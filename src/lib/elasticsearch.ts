// Elasticsearch temporarily disabled - package not installed
// import { Client } from "@elastic/elasticsearch";

// const client = new Client({
// 	cloud: {
// 		id: process.env.ELASTICSEARCH_CLOUD_ID || "",
// 	},
// 	auth: {
// 		apiKey: process.env.ELASTICSEARCH_API_KEY || "",
// 	},
// });

// Temporary mock client
const client = {};

export default client;
