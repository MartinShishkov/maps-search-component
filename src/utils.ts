export const isNull = (obj: any) => {
    return obj === null;
};

export const isUndefined = obj => {
    return typeof (obj) === "undefined";
};

export const isEmpty = (str: string) => {
    return str === "" && str.length === 0;
};

/**
 * Returns a boolean, indicating whether the object is not null and undefined.
 * @param obj
 */
export const isSomething = (obj: any): boolean => {
    return isNull(obj) === false && isUndefined(obj) === false;
};

/**
 * Returns the first element from a collection, that matches the given predicate.
 * Returns null if no such element was found.
 * @param collection
 * @param predicate
 */
export function find<T>(collection: T[], predicate: (e: T) => boolean): T {
    const filtered = collection.filter((e: T) => predicate(e));
    if (filtered.length === 0)
        return null;

    return filtered[0];
}