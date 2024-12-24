import { Heading, Link } from "react-aria-components";
import "../styles/Link.css";
import "./Instructions.css";

export default function Instructions() {
  return (
    <>
      <section className="instructions wrapper">
        <Heading id="instructions" level={2}>
          Instructions
        </Heading>
        <div className="instructions-body">
          <p>
            Packaging a package for npm is hard. There’s a steep learning curve,
            no feedback loop, competing concerns, and worst of all, publishing a
            version to npm is <em>permanent.</em> This is a tool that can help
            you package your npm module correctly based on your needs.
          </p>
          <p>
            This is an interactive visual tool so that the choices can be{" "}
            <em>explained</em> in context. Hover your cursor over the ⓘ︎ icons,
            and over highlighted lines of code, to understand the changes that
            are happening, as well as links to documentation to learn more.
          </p>
          <p>
            The choices in here are slightly opinionated. But come from JS
            community best practices and deep experience working in JS build
            tools (
            <Link
              href="https://github.com/drwpow"
              target="_blank"
              rel="noopener noreferrer"
            >
              @drwpow
            </Link>{" "}
            was a core maintainer of the JS bundler Snowpack, is a co-creator of
            Astro, and has extensive experience designing and working with
            high-scale JS build systems).
          </p>
        </div>
      </section>
      <footer className="footer wrapper">
        Made by{" "}
        <Link
          href="https://github.com/drwpow"
          target="_blank"
          rel="noopener noreferrer"
        >
          @drwpow
        </Link>
        .{" "}
        <Link
          href="https://github.com/drwpow/ts-blueprint/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          MIT License
        </Link>
        .
      </footer>
    </>
  );
}
