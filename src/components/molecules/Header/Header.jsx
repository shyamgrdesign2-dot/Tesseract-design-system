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
 *   { type: "info", label?, value, icon?, iconPosition?, radius? }
 *       — non-clickable violet data tag (ward number, doctor name, status);
 *         icon left (default) or right; radius defaults to CTA radius.
 *   { type: "divider" }       — vertical gradient Divider atom
 *   { type: "node", node }    — custom
 *     icon — Tesseract library icon NAME (string) or a ReactNode.
 *
 * Props: back, onBack, backIcon (default "arrow-left-02"),
 *        backIconVariant (default "linear"), logo, user, title, subtitle,
 *        leading, actions, height (default 62), bordered (default true), className.
 *
 * Configurability:
 *   density     "comfortable" (default) | "compact" — scales the control sizes
 *               (CTA / info / avatar 42px → 36px) and the bar padding/gap together.
 *   sticky      boolean — position: sticky; top: 0 (default false).
 *   elevation   boolean — drop shadow under the bar (default false).
 *   trailing    ReactNode — free-form right content after the `actions` array
 *               (mirrors `leading` on the left).
 *   background  token-driven surface override (default --tesseract-slate-0).
 *   borderColor token-driven bottom-border colour (default --tesseract-slate-100).
 *   onUserClick wires the user block's click (default no-op).
 *   tutorialIcon icon name | node — replaces the default play glyph in a
 *               `tutorial` action (default: the violet play-circle).
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
// The back/left glyph can be overridden (name + style) by the Header props.
function Chevron({ dir = "down", size = 18, name, variant = "linear" }) {
  const glyph = name ?? (dir === "left" ? "arrow-left-02" : "arrow-down-02");
  return <TPLibraryIcon name={glyph} variant={variant} size={size} />;
}

// Default play glyph — the hand-rolled violet play-circle. A custom `tutorialIcon`
// (name string or node) replaces it.
const DEFAULT_TUTORIAL_GLYPH = (
  <svg width="42" height="42" viewBox="0 0 48 48" fill="none" aria-hidden style={{ color: "var(--tesseract-violet-600)" }}>
    <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="3.5" fill="none" />
    <circle cx="24" cy="24" r="15" fill="currentColor" />
    <path d="M20.5 15L33 24L20.5 33V15Z" style={{ fill: "var(--tesseract-slate-0)" }} />
  </svg>
);

function TutorialButton({ onClick, glyph }) {
  return (
    <button type="button" className={styles.tutorial} aria-label="Play tutorial" onClick={onClick}>
      {glyph != null ? (typeof glyph === "string" ? icon(glyph, 42) : glyph) : DEFAULT_TUTORIAL_GLYPH}
    </button>
  );
}

function UserBlock({ name, meta, avatar, dropdown, onClick }) {
  return (
    <button type="button" className={styles.user} aria-haspopup={dropdown ? "menu" : undefined} onClick={onClick}>
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
      style={iconOnly ? { width: "var(--tesseract-header-control)", height: "var(--tesseract-header-control)" } : { height: "var(--tesseract-header-control)" }}
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

function InfoTag({ item }) {
  const glyph = item.icon ? icon(item.icon, 18) : null;
  const radiusStyle = item.radius ? { borderRadius: item.radius } : undefined;
  return (
    <div className={styles.infoTag} style={radiusStyle} role="status">
      {glyph && item.iconPosition !== "right" && <span className={styles.infoTagIcon}>{glyph}</span>}
      <span className={styles.infoTagBody}>
        {item.label && <span className={styles.infoTagLabel}>{item.label}</span>}
        <span className={styles.infoTagValue}>{item.value}</span>
      </span>
      {glyph && item.iconPosition === "right" && <span className={styles.infoTagIcon}>{glyph}</span>}
    </div>
  );
}

function Action({ item, controlPx = 42 }) {
  switch (item.type) {
    case "divider":
      return <Divider orientation="vertical" variant="gradient" color="var(--tesseract-slate-300)" style={{ height: "var(--tesseract-header-control)", opacity: 0.8 }} />;
    case "tutorial":
      return <TutorialButton onClick={item.onClick} glyph={item.icon} />;
    case "avatar":
      return <Avatar src={item.src} name={item.name} ring={item.ring} size={controlPx} onClick={item.onClick || (() => {})} />;
    case "select":
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
    case "info":
      return <InfoTag item={item} />;
    case "node":
      return item.node ?? null;
    case "cta":
    default:
      return <Cta item={item} />;
  }
}

export function Header({ back, onBack, backIcon = "arrow-left-02", backIconVariant = "linear", logo, user, title, subtitle, leading, actions = [], height = 62, bordered = true, density = "comfortable", sticky = false, elevation = false, trailing, background, borderColor, onUserClick, tutorialIcon, className }) {
  // Merge the per-Header tutorialIcon onto any `tutorial` action that doesn't set its own.
  const resolved = tutorialIcon != null
    ? actions.map((a) => (a && a.type === "tutorial" && a.icon == null ? { ...a, icon: tutorialIcon } : a))
    : actions;

  const controlPx = density === "compact" ? 36 : 42;
  const style = { height };
  if (background) style["--tesseract-header-bg"] = background;
  if (borderColor) style["--tesseract-header-border"] = borderColor;

  return (
    <header
      className={cn(styles.header, className)}
      data-bordered={bordered || undefined}
      data-density={density === "compact" ? "compact" : undefined}
      data-sticky={sticky || undefined}
      data-elevation={elevation || undefined}
      style={style}
    >
      <div className={styles.left}>
        {back && (
          <button type="button" className={styles.back} aria-label="Go back" onClick={onBack}>
            <Chevron dir="left" size={24} name={backIcon} variant={backIconVariant} />
          </button>
        )}
        {logo != null && <div className={styles.logo}>{logo}</div>}
        {user && <UserBlock {...user} onClick={user.onClick || onUserClick} />}
        {title != null && (
          <div className={styles.titleBlock}>
            <div className={styles.title}>{title}</div>
            {subtitle != null && <div className={styles.subtitle}>{subtitle}</div>}
          </div>
        )}
        {leading}
      </div>

      <div className={styles.actions}>
        {resolved.map((item, i) => <Action key={item.key ?? i} item={item} controlPx={controlPx} />)}
        {trailing}
      </div>
    </header>
  );
}

Header.displayName = "Header";
export default Header;
