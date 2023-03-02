import mySqlConnection from "./mysql/config";
import verticaClient from "./vertica/config";

interface QueryExecutionResult {
  time: number;
  result: any;
}

interface QueryCompareResult {
  sql: QueryExecutionResult;
  vertica: QueryExecutionResult;
}

type QueryCompareFn = (
  sqlQuery: string,
  verticaQuery: string
) => Promise<QueryCompareResult>;

export const executeQueryAndCompare: QueryCompareFn = async (
  sqlQuery: string,
  verticaQuery: string
) => {
  const result = { sql: {}, vertica: {} };
  result.sql = await executeSqlQuery(sqlQuery);

  if (verticaQuery) {
    result.vertica = await executeVerticaQuery(verticaQuery);
  }

  return result as QueryCompareResult;
};

const executeSqlQuery = (sqlQuery: string): Promise<QueryExecutionResult> => {
  const timeStart = new Date().getTime();
  return new Promise((resolve, reject) => {
    mySqlConnection.execute(sqlQuery, (err, result) => {
      const time = new Date().getTime() - timeStart;

      if (err) reject(err);

      const resolveObject: QueryExecutionResult = {
        time,
        result,
      };
      resolve(resolveObject);
    });
  });
};

const executeVerticaQuery = (
  verticaQuery: string
): Promise<QueryExecutionResult> => {
  const timeStart = new Date().getTime();
  return new Promise((resolve, reject) => {
    verticaClient.query(verticaQuery, (err: Error, result: { rows: any[] }) => {
      const time = new Date().getTime() - timeStart;

      if (err) reject(err);

      const resolveObject: QueryExecutionResult = {
        time,
        result: result.rows,
      };
      resolve(resolveObject);
    });
  });
};

export const parseQueryExecutionResult = (result: QueryCompareResult) => {
  const {
    sql: { time: sqlTime },
    vertica: { time: verticaTime },
  } = result;

  return {
    sqlTime: `${sqlTime} ms`,
    verticaTime: `${verticaTime} ms`,
    timeDifference: `${Math.abs(sqlTime - verticaTime)} ms`,
    result: result.sql.result,
  };
};
