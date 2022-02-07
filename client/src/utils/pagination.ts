import { Resolver } from "@urql/exchange-graphcache";
import { stringifyVariables } from "urql";

export const notePagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // Check if data in the cache and return cache
    // console.log("fieldArgs:", fieldArgs);
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    // console.log("Field key:", fieldKey);

    const inCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "notes"
    );
    // console.log("Is it in the Cache:", inCache);

    info.partial = !inCache;
    // console.log("Partial:", info.partial);

    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolve(entityKey, fieldInfo.fieldKey) as string;
      const data = cache.resolve(key, "notes") as string[];
      const _hasMore = cache.resolve(key, "hasMore");

      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }

      // console.log("data", hasMore, data);
      results.push(...data);
    });

    return {
      __typename: "NotePagination",
      hasMore,
      notes: results,
    };
  };
};

export const userPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // Check if data in the cache and return cache
    // console.log("fieldArgs:", fieldArgs);
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    // console.log("Field key:", fieldKey);

    const inCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "users"
    );
    // console.log("Is it in the Cache:", inCache);

    info.partial = !inCache;
    // console.log("Partial:", info.partial);

    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolve(entityKey, fieldInfo.fieldKey) as string;
      const data = cache.resolve(key, "users") as string[];
      const _hasMore = cache.resolve(key, "hasMore");

      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }

      // console.log("data", hasMore, data);
      results.push(...data);
    });

    return {
      __typename: "UserPagination",
      hasMore,
      users: results,
    };
  };
};

export const commentPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // Check if data in the cache and return cache
    // console.log("fieldArgs:", fieldArgs);
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    // console.log("Field key:", fieldKey);

    const inCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "comments"
    );
    // console.log("Is it in the Cache:", inCache);

    info.partial = !inCache;
    // console.log("Partial:", info.partial);

    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fieldInfo) => {
      // console.log("fieldInfo", fieldInfo)
      const key = cache.resolve(entityKey, fieldInfo.fieldKey) as string;
      const data = cache.resolve(key, "comments") as string[];
      // console.log("data", data)
      const _hasMore = cache.resolve(key, "hasMore");

      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }

      // console.log("data", hasMore, data);
      results.push(...data);
    });

    // console.log("results", results)

    return {
      __typename: "CommentPagination",
      hasMore,
      comments: results,
    };
  };
};
