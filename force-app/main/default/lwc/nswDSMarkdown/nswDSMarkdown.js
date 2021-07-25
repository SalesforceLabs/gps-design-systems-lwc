import Parser from './blocks.js';
import HtmlRenderer from './htmlRenderer.js'

export default class NswDSMarkdown {
    reader = new Parser();
    writer = new HtmlRenderer();

    parse(markdown) {
        return this.reader.parse(markdown);
    }

    render(markdown) {
        let parsed = this.reader.parse(markdown);
        return this.writer.render(parsed);
    }

    renderEscaped(markdown) {
        let parsed = this.reader.parse(markdown.replaceAll("\\n", "\n"));
        return this.writer.render(parsed);
    }

    renderNode(node) {
        return this.writer.render(node);
    }


    extractLinks(markdown) {
        let ast = this.parse(markdown),
            walker = ast.walker(),
            event,
            type,
            index = 1,
            links = [];

        while ((event = walker.next())) {
            type = event.node.type;
            if (type === "link" && event.entering) {
                if (event.node.attrs == null) {
                    event.node.attrs = [];
                } 

                const node = new DOMParser().parseFromString(this.renderNode(event.node), "text/html").body.firstElementChild;
                links.push({
                    url: node.getAttribute("href"),
                    text: node.textContent,
                    index: index++
                });
            }
        }

        return links;
    }

    // ---- extractFirstLink(String markdown) returns { url: String, text: String }
    extractFirstLink(markdown) {
        let ast = this.parse(markdown),
            walker = ast.walker(),
            event,
            type;

        while ((event = walker.next())) {
            type = event.node.type;

            if (type === "link" && event.entering) {
                const node = new DOMParser().parseFromString(this.renderNode(event.node), "text/html").body.firstElementChild;
                return {
                    url: node.getAttribute("href"),
                    text: node.textContent
                };
            }
        }

        return { url: null, text: null };
    }
}