import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import * as handlers from "./handlers/index";
dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES } = process.env;
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(
    session(
      {
        sameSite: "none",
        secure: true
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        //Auth token and shop available in session
        //Redirect to shop upon auth
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none"
        });
        ctx.cookies.set("accessToken", accessToken, {
          httpOnly: false,
          secure: true,
          sameSite: "none"
        })
        ctx.redirect("/");
      }
    })
  );
  server.use(
    graphQLProxy({
      version: ApiVersion.April20
    })
  );

  // Create/update the shop metafield
  router.post('/updateSettingsMetafield', async ctx => {
    const updateMetafield = await fetch(`https://wishlist-marketing.myshopify.com/admin/api/2020-04/metafields.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': Cookies.get('shopOrigin'),
      },
      body: {
        "metafield": {
          "namespace": "tipjar",
          "key": "settings",
          "value": "this is a test",
          "value_type": "string"
        }
      }
    });
    const updateMetafieldJson = await updateMetafield.json();
    console.log('serverresponse:', JSON.stringify(updateMetafieldJson));
    ctx.body = updateMetafieldJson;
  });

  router.get("*", verifyRequest(), async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
