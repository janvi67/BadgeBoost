import {
  Image,
  Text,
  LegacyCard,
  LegacyStack,
  ProgressBar,
  Collapsible,
  Icon,
  Card,
  Button,
  Checkbox,
  Divider,
  Page,
} from "@shopify/polaris";
import {
  CircleChevronDownIcon,
  CircleChevronUpIcon,
} from "@shopify/polaris-icons";
import { useState, useCallback, useEffect } from "react";
import { useLoaderData } from "@remix-run/react";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);


  const response = await admin.graphql(`
    query GetStoreThemes {
      themes(first: 10) {
        edges {
          node {
            files(filenames: ["config/settings_data.json"]) {
              edges {
                node {
                  body {
                    ... on OnlineStoreThemeFileBodyText {
                      content
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `);

  const responseData = JSON.parse(await response.text()).data;
  const themes = responseData.themes.edges;

  const rawContent = themes[2].node.files?.edges?.[0]?.node?.body?.content || "{}";

  const cleanedContent = rawContent.replace(/\/\*[\s\S]*?\*\//g, "");

  const contentJson = JSON.parse(cleanedContent);

  const fileBlocks = contentJson?.current?.blocks || {};
    console.log(fileBlocks , "fileBlocks");
    
  const appBlockKey = Object.keys(fileBlocks).find((blockKey) =>
    fileBlocks[blockKey].type.includes("badgeboost")
  );

  const appIsInstalled = appBlockKey && fileBlocks[appBlockKey]?.disabled;
// shopify://apps/badgeboost/blocks/badge-boost/305ebfb3-ae2f-47ff-a443-ee913ae59b03
  console.log(appIsInstalled , "appIsInstalled");

  return {appIsInstalled}
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);


  

  return { isEnabled };
   


  
};

export default function Index() {
  const { appIsInstalled } = useLoaderData() || { appIsInstalled: false };
 
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = useState(false);

useEffect(()=>{
  setChecked(!appIsInstalled);
},[appIsInstalled])



  const handleChange = useCallback(
    (newChecked) => setChecked(newChecked),
    [],
  );

  const handleNavigate = () => {
    const storeDomain = "urbann-curate.myshopify.com";
    const themeId = "174122533233";
    const appEmbedUrl = `https://${storeDomain}/admin/themes/${themeId}/editor?context=apps`;

    window.open(appEmbedUrl, "_blank");
  };

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  return (
   <Page>
      <div style={{ margin: "100px" }}>
        <div style={{ display: "flex", textAlign: "center" }}>
          <Image
            style={{ width: "50px", height: "50px" }}
            source="/badgeBoost.png"
            alt="Badge Boost icon"
          />
          <div style={{ paddingLeft: "20px" }}>
            <Text variant="heading3xl" as="h2">
              Badge Boost
            </Text>
          </div>
        </div>

        <div style={{ height: "200px", marginTop: "50px" }}>
          <LegacyCard sectioned>
            <LegacyStack vertical>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text variant="headingMd" as="h6">
                  Get Started With Badge Boost
                </Text>
                <div
                  role="button"
                  onClick={handleToggle}
                  aria-expanded={open}
                  aria-controls="basic-collapsible"
                  style={{ cursor: "pointer" }}
                >
                  <Icon
                    source={open ? CircleChevronUpIcon : CircleChevronDownIcon}
                    tone="base"
                  />
                </div>
              </div>

              <div style={{ display: "flex" }}>
                <p style={{ width: 155 }}>2 of 2 tasks completed</p>
                <div
                  style={{ width: 500, marginTop: "8px", marginLeft: "18px" }}
                >
                  <ProgressBar progress={75} tone="primary" size="small" />
                </div>
              </div>

              <Collapsible
                open={open}
                id="basic-collapsible"
                transition={{
                  duration: "500ms",
                  timingFunction: "ease-in-out",
                }}
                expandOnPrint
              >
                <Divider borderColor="border" />
                <div style={{ marginTop: "20px" }}>
                  <Card background="bg-fill-transparent-secondary">
                    <Checkbox
                      label={
                        <Text variant="headingSm" as="h6">
                          Enable app embed
                        </Text>
                      }
                      checked={checked}
                      disabled={!checked}
                      onChange={handleChange}
                    />
                    <p>
                      Badge Boost won't show any badges widget until you've
                      enabled app embed from our app.
                    </p>
                    <div style={{ marginTop: "10px" }}>
                      <Button variant="primary" onClick={handleNavigate}>
                        Enable app embed
                      </Button>
                    </div>
                  </Card>

                  <div style={{ marginTop: "10px" }}>
                    <Checkbox
                      label={<Text as="h6">Add your first badges</Text>}
                      checked={false}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </Collapsible>
            </LegacyStack>
          </LegacyCard>
        </div>
      </div>
    </Page>
  );
}
