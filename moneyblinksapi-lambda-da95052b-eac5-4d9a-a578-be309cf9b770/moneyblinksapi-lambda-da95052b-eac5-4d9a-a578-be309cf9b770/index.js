const AWS = require("aws-sdk");
const axios = require("axios");
exports.handler = async (event) => {
  const env = false;
  allowedUsers = ["jcmedvicecu", "jcmvusa2022", "hotdoctor"];
  const envUrl = env
    ? "https://console.moneyblinks.com"
    : "http://localhost:3000";
  // TODO implement
  AWS.config.update({ region: "us-east-1" });
  const dynamoClient = new AWS.DynamoDB();
  const cognitoIdp = new AWS.CognitoIdentityServiceProvider();
  const s3 = new AWS.S3();
  console.log(JSON.stringify(event));
  /*let params = {};
  if (event && event?.arguments && event?.arguments?.values) {
    params = event?.arguments?.values;
  } else if (event && event?.body) {
    params = JSON.parse(event?.body);
  }*/
  const params = JSON.parse(event?.body);
  if (params.type == "autologin") {
    const authParams = {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: "6uta6772uva14aemd3mtq5p5kq",
      AuthParameters: {
        REFRESH_TOKEN: params?.token,
      },
    };
    let authResponse;
    try {
      authResponse = await cognitoIdp.initiateAuth(authParams).promise();
    } catch (e) {
      return {
        headers: {
          "Access-Control-Allow-Origin": envUrl,
        },
        statusCode: 200,
        body: JSON.stringify({
          error: true,
          code: e,
        }),
      };
    }
    return {
      headers: {
        "Access-Control-Allow-Origin": envUrl,
      },
      statusCode: 200,
      body: JSON.stringify({
        error: false,
      }),
    };
  } else if (params.type == "login") {
    const authParams = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: "6uta6772uva14aemd3mtq5p5kq",
      AuthParameters: {
        USERNAME: params.username.toLowerCase(),
        PASSWORD: params.password,
      },
    };
    let authResponse;
    try {
      authResponse = await cognitoIdp.initiateAuth(authParams).promise();
    } catch (e) {
      return {
        headers: {
          "Access-Control-Allow-Origin": envUrl,
        },
        statusCode: 200,
        body: JSON.stringify({
          error: true,
          code: e,
        }),
      };
    }
    if (!allowedUsers.includes(params?.username.toLowerCase())) {
      return {
        headers: {
          "Access-Control-Allow-Origin": envUrl,
        },
        statusCode: 200,
        body: JSON.stringify({
          error: true,
          code: {
            message: "User not allowed to sign in.",
            code: "UserNotAllowedException",
          },
        }),
      };
    }

    // Almacenamos el token de sesión en una variable
    const sessionToken = authResponse.AuthenticationResult.RefreshToken;
    return {
      headers: {
        ...event.headers,
        "Access-Control-Allow-Origin": envUrl,
      },
      statusCode: 200,
      body: JSON.stringify({
        error: false,
        code: {
          token: sessionToken,
        },
      }),
    };
  } else if (params.type == "scan") {
    let tableName = params?.tableName;
    let filterExpression = params?.filterExpression;
    let expressionAttributeValues = params?.expressionAttributeValues;
    const Items = await dynamoScanQuery(
      tableName,
      filterExpression,
      expressionAttributeValues
    );
    return {
      headers: {
        ...event.headers,
        "Access-Control-Allow-Origin": envUrl,
      },
      statusCode: 200,
      body: JSON.stringify({
        error: false,
        code: {
          information: Items,
        },
      }),
    };
  } else if (params.type == "getFiles") {
    let urls = [];
    const promises = params.pathNames.map(async (paths) => {
      const parametros = {
        Bucket: "moneyblinkswallets3125742-pre",
        Key: paths,
        Expires: 180,
      };
      try {
        const url = await s3.getSignedUrlPromise("getObject", parametros);
        return url;
      } catch (err) {
        console.error(err);
        return {
          headers: {
            "Access-Control-Allow-Origin": envUrl,
          },
          statusCode: 200,
          body: JSON.stringify({
            error: true,
            code: err,
          }),
        };
      }
    });
    // espera a que se completen todas las promesas
    await Promise.all(promises).then((results) => {
      urls.push(...results);
    });
    return {
      headers: {
        ...event.headers,
        "Access-Control-Allow-Origin": envUrl,
      },
      statusCode: 200,
      body: JSON.stringify({
        error: false,
        code: {
          information: urls,
        },
      }),
    };
  } else if (params.type == "getFiles2") {
    let urls = [];
    const promises = params.pathNames.map(async (paths) => {
      const parametros = {
        Bucket: "mbbucket-2022-pre",
        Key: paths,
        Expires: 180,
      };
      try {
        const url = await s3.getSignedUrlPromise("getObject", parametros);
        return url;
      } catch (err) {
        console.error(err);
        return {
          headers: {
            "Access-Control-Allow-Origin": envUrl,
          },
          statusCode: 200,
          body: JSON.stringify({
            error: true,
            code: err,
          }),
        };
      }
    });
    // espera a que se completen todas las promesas
    await Promise.all(promises).then((results) => {
      urls.push(...results);
    });
    return {
      headers: {
        ...event.headers,
        "Access-Control-Allow-Origin": envUrl,
      },
      statusCode: 200,
      body: JSON.stringify({
        error: false,
        code: {
          information: urls,
        },
      }),
    };
  } else if (params.type == "getInfo") {
    const objects = await s3
      .listObjects({ Bucket: "moneyblinkswallets3125742-pre" })
      .promise();
    const fileList = [];
    objects.Contents.forEach((obj) => {
      const fileInfo = {
        name: obj.Key,
        createdAt: obj.LastModified,
        size: obj.Size,
      };
      fileList.push(fileInfo);
    });
    return {
      headers: {
        ...event.headers,
        "Access-Control-Allow-Origin": envUrl,
      },
      statusCode: 200,
      body: JSON.stringify({
        error: false,
        code: {
          information: fileList,
        },
      }),
    };
  } else if (params.type == "getInfo2") {
    const objects = await s3
      .listObjects({ Bucket: "mbbucket-2022-pre" })
      .promise();
    const fileList = [];
    objects.Contents.forEach((obj) => {
      const fileInfo = {
        name: obj.Key,
        createdAt: obj.LastModified,
        size: obj.Size,
      };
      fileList.push(fileInfo);
    });
    return {
      headers: {
        ...event.headers,
        "Access-Control-Allow-Origin": envUrl,
      },
      statusCode: 200,
      body: JSON.stringify({
        error: false,
        code: {
          information: fileList,
        },
      }),
    };
  } else if (params.type == "setItem") {
    const item = params?.object;
    try {
      await dynamoClient.batchWriteItem(item).promise();
      return {
        headers: {
          ...event.headers,
          "Access-Control-Allow-Origin": envUrl,
        },
        statusCode: 200,
        body: JSON.stringify({
          error: false,
          code: {
            information: "completed",
          },
        }),
      };
    } catch (err) {
      console.error(err);
      return {
        headers: {
          "Access-Control-Allow-Origin": envUrl,
        },
        statusCode: 200,
        body: JSON.stringify({
          error: true,
          code: err,
        }),
      };
    }
  } else if (params?.type == "getTXS") {
    const transactions = [];
    const response = await axios.get("https://api.checkbook.io/v3/check", {
      headers: {
        Authorization:
          "2136ae8d6b62491989656456076cc43e:ucwYWVTyFg1ppLXhQmUK8vEfEFuAb5",
      },
    });
    transactions.push(...response.data.checks);
    if (response.data.pages != 1) {
      for (let i = 2; i < (parseInt(response.data.pages) + 1); i++) {
        const response2 = await axios.get(
          "https://api.checkbook.io/v3/check?page=" + i + "",
          {
            headers: {
              Authorization:
                "2136ae8d6b62491989656456076cc43e:ucwYWVTyFg1ppLXhQmUK8vEfEFuAb5",
            },
          }
        );
        transactions.push(...response2.data.checks);
      }
    }
    return {
      headers: {
        "Access-Control-Allow-Origin": envUrl,
      },
      statusCode: 200,
      body: JSON.stringify({
        error: false,
        code: transactions,
      }),
    };
  } else {
    const response = {
      headers: {
        "Access-Control-Allow-Origin": envUrl,
      },
      statusCode: 200,
      body: JSON.stringify(event),
    };
    return response;
  }

  async function dynamoScanQuery(
    tableName,
    filterExpression,
    expressionAttributeValues
  ) {
    const results = [];
    let lastEvaluatedKey = null;
    while (true) {
      const parametros = {
        TableName: tableName,
        FilterExpression: filterExpression ? filterExpression : undefined,
        ExpressionAttributeValues: expressionAttributeValues
          ? expressionAttributeValues
          : undefined,
      };

      if (lastEvaluatedKey) {
        parametros.ExclusiveStartKey = lastEvaluatedKey;
      }
      const response = await dynamoClient.scan(parametros).promise();
      results.push(...response.Items);
      lastEvaluatedKey = response.LastEvaluatedKey;
      if (!lastEvaluatedKey) {
        break;
      }
    }
    return results;
  }
};
