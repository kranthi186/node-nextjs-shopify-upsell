import { useState } from "react";
import { Page, Layout, Card, Link } from "@shopify/polaris";
import "../components/custom.css";

const Plan = (shopSettings) => {
  const shopPlan = shopSettings.shopInformation
    ? shopSettings.shopInformation.subscription_plan
    : 0;
  const [currentPlan, setCurrentPlan] = useState(shopPlan);
  const planList = ["Free", "Standard", "Premium"];
  let currentPlanString;
  currentPlanString =
    "Plan List (Your current plan is " + planList[currentPlan] + ")";

  /*const joinStandard = async () => {
    console.log("arrive standard");
    const joinStandardRes = await fetch("/joinStandard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shop_owner: shopSettings.shopInformation.store_owner_email,
        shop_domain: shopSettings.shopInformation.shop_domain,
      }),
    });

    const joinStandardJson = await joinStandardRes.json();
    console.log("joinStandardJson: ", joinStandardJson);
    setCurrentPlan(1);
    window.top.location.replace(joinStandardJson.storeData.confirmationUrl);
  };*/

  const joinPremium = async () => {
    console.log("arrive premium");
    const joinPremiumRes = await fetch("/joinPremium", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shop_owner: shopSettings.shopInformation.store_owner_email,
        shop_domain: shopSettings.shopInformation.shop_domain,
      }),
    });

    const joinPremiumJson = await joinPremiumRes.json();
    setCurrentPlan(2);
    window.top.location.replace(joinPremiumJson.storeData.confirmationUrl);
  };

  const downGrade = async () => {
    console.log("arrive downGrade");
    const downGradeRes = await fetch("/downGrade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chargeId: shopSettings.shopInformation.charge_id,
      }),
    });

    const downGradeJson = await downGradeRes.json();
    setCurrentPlan(0);
  };

  return (
    <Page title="Your Subscription Plan">
      <Layout>
        <Layout.Section>
          <Card title={currentPlanString}>
            <Card.Section title="Free">
              <p>
                Collect tips from your customers before checkout. Completely
                free to use!
              </p>
            </Card.Section>

            {/* <Card.Section
              title="Standard"
              actions={[
                {
                  content: currentPlan == 1 ? "Unsubscribe" : "Subscribe",
                  onAction: currentPlan == 1 ? downGrade : joinStandard,
                  disabled: currentPlan == 2,
                },
              ]}
            >
              <p>You have no limitations.</p>
            </Card.Section> */}
            <Card.Section
              title="Premium"
              actions={[
                {
                  content: currentPlan == 2 ? "Unsubscribe" : "Subscribe",
                  onAction: currentPlan == 2 ? downGrade : joinPremium,
                  disabled: currentPlan == 1,
                },
              ]}
            >
              <div>
                <p>Includes more ways to customize the tip modal:</p>
                <ul>
                  <li>Show a custom tip amount option</li>
                  <li>Hide the 'Powered by TipQuik' text</li>
                  <li>Access to more premium options as they are released</li>
                </ul>
              </div>
            </Card.Section>
          </Card>
          <Card sectioned title="Need help? Questions? Comments?">
            <p>
              Don't hesitate to get in touch with us! We will be happy to assist
              you with anything TipQuik related. Send us an email anytime to{" "}
              <span className="install-email">
                <Link external url="mailto:support@aesymmetric.xyz">
                  support@aesymmetric.xyz
                </Link>
              </span>
              . We'll respond within 24 hours.
            </p>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

Plan.getInitialProps = async (ctx) => {
  let shopOrigin = "";
  if (ctx.query.shop) {
    shopOrigin = ctx.query.shop;
  } else {
    ctx.req.headers.cookie.split(";").map((pairValue) => {
      if (pairValue.includes("shopOrigin=")) {
        shopOrigin = pairValue.split("shopOrigin=")[1];
      }
    });
  }
  const shopSettings = await fetch(process.env.HOST + "getShopSettings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shop_domain: shopOrigin,
    }),
  });

  const settings = await shopSettings.json();
  return settings;
};

export default Plan;