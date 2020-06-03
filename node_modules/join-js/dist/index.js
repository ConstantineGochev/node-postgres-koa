'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/** Thrown when mapOne does not find an object in the resultSet and "isRequired" is passed in as true */
function NotFoundError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Not Found';

    this.name = 'NotFoundError';
    this.message = message;
    this.stack = new Error().stack;
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

/**
 * Maps a resultSet to an array of objects.
 *
 * @param {Array} resultSet - an array of database results
 * @param {Array} maps - an array of result maps
 * @param {String} mapId - mapId of the top-level objects in the resultSet
 * @param {String} [columnPrefix] - prefix that should be applied to the column names of the top-level objects
 * @returns {Array} array of mapped objects
 */
function map(resultSet, maps, mapId, columnPrefix) {

    var mappedCollection = [];

    resultSet.forEach(function (result) {
        injectResultInCollection(result, mappedCollection, maps, mapId, columnPrefix);
    });

    return mappedCollection;
}

/**
 * Maps a resultSet to a single object.
 *
 * Although the result is a single object, resultSet may have multiple results (e.g. when the
 * top-level object has many children in a one-to-many relationship). So mapOne() must still
 * call map(), only difference is that it will return only the first result.
 *
 * @param {Array} resultSet - an array of database results
 * @param {Array} maps - an array of result maps
 * @param {String} mapId - mapId of the top-level object in the resultSet
 * @param {String} [columnPrefix] - prefix that should be applied to the column names of the top-level object
 * @param {boolean} [isRequired] - is it required to have a mapped object as a return value? Default is true.
 * @returns {Object} one mapped object or null
 * @throws {NotFoundError} if object is not found and isRequired is true
 */
function mapOne(resultSet, maps, mapId, columnPrefix) {
    var isRequired = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;


    var mappedCollection = map(resultSet, maps, mapId, columnPrefix);

    if (mappedCollection.length > 0) {
        return mappedCollection[0];
    } else if (isRequired) {
        throw new NotFoundError('EmptyResponse');
    } else {
        return null;
    }
}

/**
 * Maps a single database result to a single object using mapId and injects it into mappedCollection.
 *
 * @param {Object} result - a single database result (one row)
 * @param {Array} mappedCollection - the collection in which the mapped object should be injected.
 * @param {Array} maps - an array of result maps
 * @param {String} mapId - mapId of the top-level objects in the resultSet
 * @param {String} [columnPrefix] - prefix that should be applied to the column names of the top-level objects
 */
function injectResultInCollection(result, mappedCollection, maps, mapId) {
    var columnPrefix = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';


    // Check if the object is already in mappedCollection
    var resultMap = maps.find(function (map) {
        return map.mapId === mapId;
    });
    var idProperty = getIdProperty(resultMap);
    var predicate = idProperty.reduce(function (accumulator, field) {
        accumulator[field.name] = result[columnPrefix + field.column];
        return accumulator;
    }, {});

    var mappedObject = mappedCollection.find(function (item) {
        for (var k in predicate) {
            if (item[k] !== predicate[k]) {
                return false;
            }
        }
        return true;
    });

    // Inject only if the value of idProperty is not null (ignore joins to null records)
    var isIdPropertyNotNull = idProperty.every(function (field) {
        return result[columnPrefix + field.column] !== null;
    });

    if (isIdPropertyNotNull) {
        // Create mappedObject if it does not exist in mappedCollection
        if (!mappedObject) {
            mappedObject = createMappedObject(resultMap);
            mappedCollection.push(mappedObject);
        }

        // Inject result in object
        injectResultInObject(result, mappedObject, maps, mapId, columnPrefix);
    }
}

/**
 * Injects id, properties, associations and collections to the supplied mapped object.
 *
 * @param {Object} result - a single database result (one row)
 * @param {Object} mappedObject - the object in which result needs to be injected
 * @param {Array} maps - an array of result maps
 * @param {String} mapId - mapId of the top-level objects in the resultSet
 * @param {String} [columnPrefix] - prefix that should be applied to the column names of the top-level objects
 */
function injectResultInObject(result, mappedObject, maps, mapId) {
    var columnPrefix = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';


    // Get the resultMap for this object
    var resultMap = maps.find(function (map) {
        return map.mapId === mapId;
    });

    // Copy id property
    var idProperty = getIdProperty(resultMap);

    idProperty.forEach(function (field) {
        if (!mappedObject[field.name]) {
            mappedObject[field.name] = result[columnPrefix + field.column];
        }
    });

    var properties = resultMap.properties,
        associations = resultMap.associations,
        collections = resultMap.collections;

    // Copy other properties

    properties && properties.forEach(function (property) {
        // If property is a string, convert it to an object
        if (typeof property === 'string') {
            // eslint-disable-next-line
            property = { name: property, column: property };
        }

        // Copy only if property does not exist already
        if (!mappedObject[property.name]) {

            // The default for column name is property name
            var column = property.column ? property.column : property.name;

            mappedObject[property.name] = result[columnPrefix + column];
        }
    });

    // Copy associations
    associations && associations.forEach(function (association) {

        var associatedObject = mappedObject[association.name];

        if (!associatedObject) {
            var associatedResultMap = maps.find(function (map) {
                return map.mapId === association.mapId;
            });
            var associatedObjectIdProperty = getIdProperty(associatedResultMap);

            mappedObject[association.name] = null;

            // Don't create associated object if it's key value is null
            var isAssociatedObjectIdPropertyNotNull = associatedObjectIdProperty.every(function (field) {
                return result[association.columnPrefix + field.column] !== null;
            });

            if (isAssociatedObjectIdPropertyNotNull) {
                associatedObject = createMappedObject(associatedResultMap);
                mappedObject[association.name] = associatedObject;
            }
        }

        if (associatedObject) {
            injectResultInObject(result, associatedObject, maps, association.mapId, association.columnPrefix);
        }
    });

    // Copy collections
    collections && collections.forEach(function (collection) {

        var mappedCollection = mappedObject[collection.name];

        if (!mappedCollection) {
            mappedCollection = [];
            mappedObject[collection.name] = mappedCollection;
        }

        injectResultInCollection(result, mappedCollection, maps, collection.mapId, collection.columnPrefix);
    });
}

function createMappedObject(resultMap) {
    return resultMap.createNew ? resultMap.createNew() : {};
}

function getIdProperty(resultMap) {

    if (!resultMap.idProperty) {
        return [{ name: 'id', column: 'id' }];
    }

    var idProperties = resultMap.idProperty;

    if (!Array.isArray(idProperties)) {
        idProperties = [idProperties];
    }

    return idProperties.map(function (idProperty) {

        // If property is a string, convert it to an object
        if (typeof idProperty === 'string') {
            return { name: idProperty, column: idProperty };
        }

        // The default for column name is property name
        if (!idProperty.column) {
            idProperty.column = idProperty.name;
        }

        return idProperty;
    });
}

var joinjs = {
    map: map,
    mapOne: mapOne,
    NotFoundError: NotFoundError
};

exports.default = joinjs;