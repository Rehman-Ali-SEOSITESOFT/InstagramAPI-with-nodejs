const { UserInputError } = require("apollo-server-express");
const { get } = require("axios").default;
const { post } = require("request");
const { promisify } = require("util");
require("dotenv").config();

const postAsync = promisify(post);


async function getShortLivedAccessToken() {
    // sending the request.
    let { body, statusCode } = await postAsync({
      url: `https://api.instagram.com/oauth/access_token `,
      formData: {
        client_id: "1272368890345306",
        client_secret: "5565ae838496abaf0c8084a02102352c",
        redirect_uri: "https://manikhan.com/",
        code: "AQDRko17wni4bVU-xpovPT6K5Vq2GgUll1G-njrYrKbyKolqSaLXhGcW5NVmjSB1vEYwahC3EGBBc3IloSFsSN2qYKbtC360UBZyiJe3qll5oGimMk_c3omXVeC34PmP54jdGnFwDJysrsg1LgkCWy6AX1l0OEn6SUmsu84GNM9d47gRZvyaHSmDiSLd0xE8ztwbsLgBEkp4PWVGtU1980SMg1TLL3IHof9PHv-qhfWc0w",
        grant_type: "authorization_code",
      },
      headers: {
        "content-type": "multipart/form-data",
        host: "api.instagram.com",
      },
    });
  
    // getting the response.
    let response = JSON.parse(body);
  
    // checking the status code for error.
    if (statusCode !== 200) {
      let error_message = response.error_message;
      // if error exists, sending the error.
      return new UserInputError(error_message);
    }
  
    // if no error exists, returning the response.
    return response;
  }


  // getting a long lived access token
async function getLongLivedAccessToken() {
    let response;
  
    try {
      // send a request to the API
      response = await get("https://graph.instagram.com/access_token", {
        params: {
          grant_type: "ig_exchange_token",
          client_secret: process.env.INSTAGRAM_APP_SECRET,
          access_token: process.env.SHORT_LIVED_AT,
        },
        headers: {
          host: "graph.instagram.com",
        },
      });
    } catch (error) {
      // If an error occurs, return it.
      return new UserInputError(error);
    }
  
    // If no error, get the response and return it.
    response = response["data"];
    return response;
  }



  // getting profile data
async function getProfileData() {
    let response;
    // send request to the API
    try {
      response = await get("https://graph.instagram.com/me", {
        params: {
          fields: "id,username,media_count,account_type",
          access_token: "IGQVJXWWxraXJBeGZA0VzFRVVBMMlFwQkFkU0V6ZATc4VUFidnlaU0Fia3JXZAmxwYlR0SEFLZAVhFa21WVHJ5MG5OYVdZAbkE4LVE1bHd2RGN4TnJ3MHBoampFenp3SWpjVTdiSkw4TTBn",
        },
        headers: {
          host: "graph.instagram.com",
        },
      });
    } catch (error) {
      // catch and return the error
      return new UserInputError(error);
    }
  
    // get the data and return it.
    response = response["data"];
    return response;
  }


  // getting media data
async function getUserMediaData() {
    let response;
  
    // sending request to API
    try {
      response = await get("https://graph.instagram.com/me/media", {
        params: {
          fields:
            "id,caption,media_url,media_type,permalink,thumbnail_url,timestamp,username",
          access_token: "AQA_KS2Y7mLY0IRrcMRmwCzlbxYHhDiPrIe0Bswub9HGsRCK-pa5x5Ln3QSdo_7M6vVJlY9rFwIfcK_P4YR8Bv1ZUl_nrj1uM80wmOjC77SGElVLfMQY3OVEHGl-Nx4myV9HFbC_BOa3yZf6CmGHWDX2XIuGolJVN7sXdS2RpagJK80sZYhk5YrgWq-RN-iXhlFiGc8hEWsxSIMTAq1CqIqZuRCih2vKnfT9jzHZuSQDBg",
        },
        headers: {
          host: "graph.instagram.com",
        },
      });
    } catch (error) {
      // Catching an error, and returning it.
      return new UserInputError(error);
    }
  
    // If no error, returning the response.
    response = response["data"];
    return response.data;
  }

  module.exports = {
    getShortLivedAccessToken,
    getLongLivedAccessToken,
    getProfileData,
    getUserMediaData
  };