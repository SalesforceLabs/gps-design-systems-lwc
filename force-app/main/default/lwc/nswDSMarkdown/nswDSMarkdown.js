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

    renderLinks(markdown) {
        let ast = this.parse(markdown),
            walker = ast.walker(),
            event,
            type,
            html = "";

        while ((event = walker.next())) {
            type = event.node.type;
            if (type === "link" && event.entering) {
                if (event.node.attrs == null) {
                    event.node.attrs = [];
                } 
                html += "<li>" + this.renderNode(event.node) + "</li>";
            }
        }

        return html;
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


    // ---- extract H1s and content
    extractH1s(markdown) {
        let ast = this.parse(markdown),
        walker = ast.walker(),
        event,
        type,
        level,
        html = "",
        index = 1,
        h1s = [],
        h1;

        while ((event = walker.next())) {
            type = event.node.type;
            level = event.node.level;
            if (type === "heading" && level == 1) {
                if (event.entering) {

                    if (event.node.attrs == null) {
                        event.node.attrs = [];
                    } 

                    const node = new DOMParser().parseFromString(this.renderNode(event.node), "text/html").body.firstElementChild;
                    if (h1) { // flush ongoing one
                        h1.html = html;
                        h1s.push(h1);
                    }

                    h1 = {
                        title: node.textContent,
                        index: index++
                    };

                    html = "";
                } 
            } else if (event.entering && h1) {
                switch(event.node.type) {
                    case "text":
                    case "linebreak":
                        break;
                    default:
                        let n = this.renderNode(event.node);
                        console.log('rendering ' + event.node.type, n);
                        html += n;
                }
            }
        }

        if (h1) { // flush final one
            h1.html = html;
            h1s.push(h1);
        }

        return h1s;
    }
}