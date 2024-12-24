import { Heading, Link } from "react-aria-components";
import "../styles/Link.css";
import "./Header.css";

export default function Header() {
  return (
    <section className="header wrapper">
      <div className="header-layout">
        <div className="header-main">
          <Heading level={1}>TS Blueprint</Heading>
          <Link className="header-link" href="#instructions">
            Instructions
          </Link>
        </div>

        <nav className="header-nav" aria-label="Additional links">
          <ul>
            <li>
              <a
                href="https://github.com/drwpow/ts-blueprint"
                aria-label="TS Blueprint on GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  width="76"
                  height="20"
                  alt="TS Blueprint on GitHub"
                  src="https://img.shields.io/github/stars/drwpow/ts-blueprint"
                />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}
