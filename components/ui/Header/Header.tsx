"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import Container from "@/components/ui/Container/Container";
import Button from "../Button";

const NAV_LINKS = [
  { label: "Facilities", href: "/#features" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={styles.headerOuter} role="banner">
      <Container>
        <div className={styles.header}>
            <Link
            href="/"
            className={styles.logo}
            aria-label="Conferra — Return to home"
            >
            CONFERRA
            </Link>

            <nav className={styles.nav} aria-label="Primary navigation">
            {NAV_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} className={styles.navLink}>
                {label}
                </Link>
            ))}
            </nav>

            <div className={styles.headerRight}>
            <Link href="/#contact" className={styles.bookButton}>
                <Button>Contact Us</Button>
            </Link>

            <button
                type="button"
                className={styles.hamburger}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-nav"
                onClick={() => setOpen((v) => !v)}
            >
                <span
                className={`${styles.bar} ${open ? styles.barTopOpen : ""}`}
                />
                <span
                className={`${styles.bar} ${open ? styles.barMidOpen : ""}`}
                />
                <span
                className={`${styles.bar} ${open ? styles.barBotOpen : ""}`}
                />
            </button>
            </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`${styles.overlay} ${open ? styles.overlayVisible : ""}`}
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
        <div
          id="mobile-nav"
          ref={drawerRef}
          className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
          aria-label="Mobile navigation"
        >
          <nav className={styles.drawerNav}>
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={styles.drawerLink}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
            >
              <Button>Contact Us</Button>
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
