"use client";

/**
 * Header — the single configurable top bar (home shell, RxPad, print, …).
 * Composed from atoms: Button (every CTA), Avatar, Divider, Badge (dot), Logo.
 *
 * LEFT cluster (in order, all optional):
 *   back    boolean   — full-height 40px back button (onBack)
 *   logo    ReactNode — brand mark (use the Logo atom)
 *   user    { name, meta, avatar?, dropdown? } — patient / user details block
 *   title   ReactNode — leading title (+ optional `subtitle` for title + subtext)
 *   subtitle ReactNode
 *   leading ReactNode — fully custom left content (escape hatch)
 *
 * RIGHT cluster — `actions`: an ordered list (max 8) of typed items. Only
 * `tutorial` and `avatar` are special; everything else is a CTA (the Button
 * atom), and dividers are placed explicitly wherever you want them:
 *   { type: "cta", label?, icon?, variant?, theme?, onClick, menu?, badge?, ariaLabel? }
 *       label + icon → text CTA; icon only (no label) → icon button;
 *       menu → split button (the only Button shape with a dropdown side);
 *       badge:{color} → a notification dot on an icon CTA.
 *   { type: "avatar", src?, name?, ring?, onClick }
 *   { type: "select", options, value, onClick→onChange, icon?, searchable?, width? }
 *       — single-select dropdown that reads like a CTA (e.g. clinic switcher);
 *         auto-searchable past 5 options. Composes the Dropdown molecule.
 *   { type: "tutorial", onClick }
 *   { type: "divider" }       — vertical gradient Divider atom
 *   { type: "node", node }    — custom
 *     icon — Tesseract library icon NAME (string) or a ReactNode.
 *
 * Props: back, onBack, logo, user, title, subtitle, leading, actions,
 *        height (default 62), bordered (default true), className.
 */

import * as React from "react";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { Avatar } from "@/src/components/atoms/Avatar";
import { Divider } from "@/src/components/atoms/Divider";
import { Dropdown } from "@/src/components/molecules/Dropdown";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Header.module.scss";

const icon = (g, size = 20) => (typeof g === "string" ? <TPLibraryIcon name={g} size={size} /> : g);

// Chevrons come from the Iconsax library (arrow-*-02), like every other icon.
function Chevron({ dir = "down", size = 18 }) {
  return <TPLibraryIcon name={dir === "left" ? "arrow-left-02" : "arrow-down-02"} size={size} />;
}

function TutorialButton({ onClick }) {
  return (
    <button type="button" className={styles.tutorial} aria-label="Play tutorial" onClick={onClick}>
      <svg width="42" height="42" viewBox="0 0 48 48" fill="none" aria-hidden style={{ color: "var(--tp-violet-600)" }}>
        <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="3.5" fill="none" />
        <circle cx="24" cy="24" r="15" fill="currentColor" />
        <path d="M20.5 15L33 24L20.5 33V15Z" style={{ fill: "var(--tp-slate-0)" }} />
      </svg>
    </button>
  );
}

function UserBlock({ name, meta, avatar, dropdown }) {
  return (
    <button type="button" className={styles.user} aria-haspopup={dropdown ? "menu" : undefined}>
      {avatar !== false && (
        typeof avatar === "string"
          ? <Avatar src={avatar} name={name} size={40} />
          : avatar || <Avatar name={name} size={40} />
      )}
      <span className={styles.userText}>
        <span className={styles.userName}>
          {name}
          {dropdown && <Chevron size={16} />}
        </span>
        {meta && <span className={styles.userMeta}>{meta}</span>}
      </span>
    </button>
  );
}

// One CTA → the Button atom. Covers text / icon-only / split (the only Button
// shapes), with an optional notification dot (Badge) for icon CTAs. For a real
// dropdown use the `select` action (the Dropdown molecule).
function Cta({ item }) {
  const glyph = item.icon ? icon(item.icon) : undefined;
  const iconOnly = !!glyph && item.label == null;
  const btn = (
    <Button
      variant={item.variant || "solid"}
      theme={item.theme || "primary"}
      size="md"
      onClick={item.onClick}
      menu={item.menu}
      aria-label={iconOnly ? (item.ariaLabel || item.label) : undefined}
      icon={iconOnly || item.menu ? glyph : undefined}
      leftIcon={!iconOnly && !item.menu ? glyph : undefined}
      style={iconOnly ? { width: "var(--tp-size-42)", height: "var(--tp-size-42)" } : { height: "var(--tp-size-42)" }}
    >
      {iconOnly ? undefined : <span className={styles.ctaLabel}>{item.label}</span>}
    </Button>
  );
  if (item.badge) {
    return (
      <span className={styles.iconWrap}>
        {btn}
        <span className={styles.dot}><Badge variant="dot" color={item.badge.color || "error"} size="md" /></span>
      </span>
    );
  }
  return btn;
}

function Action({ item }) {
  switch (item.type) {
    case "divider":
      return <Divider orientation="vertical" variant="gradient" color="var(--tp-slate-300)" style={{ height: "var(--tp-size-42)", opacity: 0.8 }} />;
    case "tutorial":
      return <TutorialButton onClick={item.onClick} />;
    case "avatar":
      return <Avatar src={item.src} name={item.name} ring={item.ring} size={42} onClick={item.onClick || (() => {})} />;
    case "select":
      // A single-select dropdown that reads like a CTA (clinic switcher).
      // Auto-searchable past 5 options.
      return (
        <Dropdown
          mode="single"
          options={item.options || []}
          value={item.value}
          onChange={item.onChange}
          searchable={item.searchable ?? ((item.options || []).length > 5)}
          leadingIcon={item.icon ? icon(item.icon, 18) : undefined}
          width={item.width || "auto"}
          placeholder={item.placeholder || "Select"}
        />
      );
    case "node":
      return item.node ?? null;
    case "cta":
    default:
      return <Cta item={item} />;
  }
}

export function Header({ back, onBack, logo, user, title, subtitle, leading, actions = [], height = 62, bordered = true, className }) {
  return (
    <header className={cn(styles.header, className)} data-bordered={bordered || undefined} style={{ height }}>
      <div className={styles.left}>
        {back && (
          <button type="button" className={styles.back} aria-label="Go back" onClick={onBack}>
            <Chevron dir="left" size={24} />
          </button>
        )}
        {logo != null && <div className={styles.logo}>{logo}</div>}
        {user && <UserBlock {...user} />}
        {title != null && (
          <div className={styles.titleBlock}>
            <div className={styles.title}>{title}</div>
            {subtitle != null && <div className={styles.subtitle}>{subtitle}</div>}
          </div>
        )}
        {leading}
      </div>

      <div className={styles.actions}>
        {actions.map((item, i) => <Action key={item.key ?? i} item={item} />)}
      </div>
    </header>
  );
}

Header.displayName = "Header";
export default Header;
