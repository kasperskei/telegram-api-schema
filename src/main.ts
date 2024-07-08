import {parseHTML} from 'linkedom'
import {getSchema, getSchemaConstructor} from '@/schemaGenerator/api.ts'
import {parseTgUserApiSchema} from '@/schemaGenerator/parsers/parseTgUserApiSchema.ts'
import {parseTgUserApiSchemaConstructors} from '@/schemaGenerator/parsers/parseTgUserApiSchemaConstructors.ts'
import {parseTgUserApiSchemaMethod} from '@/schemaGenerator/parsers/parseTgUserApiSchemaMethod.ts'
import {parseTgUserApiSchemaConstructor} from '@/schemaGenerator/parsers/parseTgUserApiSchemaConstructor.ts'

const main = async () => {
  const schemaDto = await getSchema()
  const schema = parseTgUserApiSchema(schemaDto)

  // console.log(schema.constructors.findIndex((x) => x.predicate === 'updateChannelViewForumAsMessages'))

  const constructorsDto = await Promise.all(schema.constructors
    .slice(1164, 1165)
    .map(async (constructor) => {
      const constructorDto = await getSchemaConstructor(constructor.predicate)
      const {description, params} = parseTgUserApiSchemaConstructor(constructorDto)

      constructor.description = description
      constructor.params.forEach((param) => {
        param.description = params[param.propName] ?? ''
      })

      return constructor
    }))

  console.log(JSON.stringify(constructorsDto, null, 2))

  // const rewriter = new HTMLRewriter()

  // rewriter.on('#dev_page_content', {
  //   element: (element) => {
  //     console.log(element.tagName, element.getAttribute('id'))
  //     // element
  //   },
  // })

  // console.log(rewriter.transform(new Response(constructorsDto[0]!)).text())

  // const html = await getSchemaConstructor('updateChannelViewForumAsMessages')
  // const {document} = parseHTML(html)

  // const content = document.querySelector('#dev_page_content')!
  // content.querySelector('dev_page_content')?.remove()

  // content.querySelectorAll('a').forEach((anchor) => {
  //   anchor.href = 'https://core.telegram.org' + anchor.href
  // })

  // const description = turndownService.turndown(content.children.item(0)?.innerHTML ?? '')
  // const params = Object.fromEntries(Array.from(content.querySelector('#parameters')
  //   ?.parentElement
  //   ?.nextElementSibling
  //   ?.querySelector('tbody')
  //   ?.querySelectorAll('tr')
  //   ?.values() ?? []
  // ).map((tr) => [
  //   tr.children.item(0)?.textContent,
  //   tr.children.item(2)?.textContent,
  // ]))

  // // const related = content.querySelector('#related-pages')?.parentElement?.nextElementSibling

  // console.log(description)
  // console.log(params)
}

await main()
