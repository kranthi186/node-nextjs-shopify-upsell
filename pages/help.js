import { Page, Layout, Card, TextStyle, Button } from '@shopify/polaris';
import snippetContent from '../utils/snippetContent';

const Help = () => {

  const handleCreateSnippet = async () => {
    const createSnippet = await fetch('/createSnippet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        asset: {
          key: 'snippets/tipjar.liquid',
          value: snippetContent,
        }
      })
    });
    const createSnippetJson = await createSnippet.json();
    console.log('Response for createSnippetJson:', JSON.stringify(createSnippetJson));
  }

  return (
    <Page title="Help Center. We are here for you.">
      <Layout>
        <Layout.Section>
          <Card title="Create the snippet" sectioned>
            <p>Click the button below to install the <TextStyle variation="code">tipjar.liquid</TextStyle> snippet on your published theme.</p>
            <Button primary onClick={handleCreateSnippet}>Create theme snippet</Button>
          </Card>

          <Card title="Include the snippet on your theme" sectioned>            
            <p>Manually add the below code to your <TextStyle variation="code">theme.liquid</TextStyle> file, directly above the <TextStyle variation="code">{'</body>'}</TextStyle> tag.</p>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

export default Help;
