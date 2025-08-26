const { SSMClient, GetParametersCommand } = require("@aws-sdk/client-ssm");

// Reusable function to fetch DB credentials from AWS SSM Parameter Store
async function loadDbConfig() {
  const ssm = new SSMClient({ region: "ap-south-1" }); // change to your AWS region

  const command = new GetParametersCommand({
    Names: [
      "/graphql_backend/prod/DB_USER_PROD",
      "/graphql_backend/prod/DB_PASS_PROD",
      "/graphql_backend/prod/DB_URL_PROD",
    ],
    WithDecryption: true,
  });

  const response = await ssm.send(command);
  console.log("SSM Response:", response);
  const params = {};
  response.Parameters.forEach((p) => {
    const key = p.Name.split("/").pop(); // e.g., DB_USER
    params[key] = p.Value;
  });
  console.log("Fetched DB Params:", params);
  return {
    username: params.DB_USER_PROD,
    password: encodeURIComponent(params.DB_PASS_PROD),
    url: params.DB_URL_PROD,
  };
}

module.exports = { loadDbConfig };



// import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

// const ssm = new SSMClient({ region: "ap-south-1" }); // change to your AWS region

// async function getParameter(name, withDecryption = false) {
//   const command = new GetParameterCommand({
//     Name: name,
//     WithDecryption: withDecryption,
//   });
//   const response = await ssm.send(command);
//   return response.Parameter.Value;
// }

// export async function loadDbConfig() {
//   const username = await getParameter("/graphql_backend/prod/DB_USER_PROD", true);
//   const password = await getParameter("/graphql_backend/prod/DB_PASS_PROD", true);
//   const url = await getParameter("/graphql_backend/prod/DB_URL_PROD", true);

//   return {
//     username,
//     password: encodeURIComponent(password),
//     url
//   };
// }
