import { Meteor } from 'meteor/meteor'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import gql from 'graphql-tag'

const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'https://www.graphqlhub.com/graphql',
    transportBatching: true,
  }),
})

const renderGif = gif => `<div>
  <a href="${gif.url}">
    <div>ID: ${gif.id}</div>
    <img style="max-width: 200px" src="${gif.images.original.url}" />
  </a>
</div>`

const renderApp = ({ gifs }) => `
<div>
  <h1>Gifs from Giphy</h1>
  ${gifs.map(gif => renderGif(gif)).join('')}
</div>
`

Meteor.startup(async function() {
  const rootDiv = document.getElementById('root')

  const { data } = await apolloClient.query({
    query: gql`
      query GiphyGifs($query: String!) {
        giphy {
          search(query: $query, limit: 10) {
            id
            url
            images {
              original {
                url
              }
            }
          }
        }
      }
    `,
    variables: {
      query: 'random',
    },
  })

  rootDiv.innerHTML = renderApp({
    gifs: data.giphy.search,
  })
})
