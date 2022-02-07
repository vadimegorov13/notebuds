import { Cache } from "@urql/exchange-graphcache";

export const invalidateNotes = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "notes");

  fieldInfos.forEach((fieldInfo) => {
    cache.invalidate("Query", "notes", fieldInfo.arguments || {});
  });
};

export const invalidateUsers = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "users");

  fieldInfos.forEach((fieldInfo) => {
    cache.invalidate("Query", "users", fieldInfo.arguments || {});
  });
};


export const invalidateComments = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "comments");

  fieldInfos.forEach((fieldInfo) => {
    cache.invalidate("Query", "comments", fieldInfo.arguments || {});
  });
};