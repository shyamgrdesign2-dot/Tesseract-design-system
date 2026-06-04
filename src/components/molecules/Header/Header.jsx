"use client";

/**
 * Header — the single configurable top bar (home shell, RxPad, print, …).
 * In-house, composed from atoms (Button for CTAs, Badge for dots/tags).
 *
 * LEFT cluster (in order, all optional):
 *   back   boolean            — bordered 80px back button (onBack)
 *   logo   ReactNode          — brand mark
 *   user   { name, meta, avatar?, dropdown? }  — patient / user details block
 *   title  ReactNode          — plain leading text
 *   leading ReactNode         — fully custom left content (escape hatch)
 *
 * RIGHT cluster — `actions`: an ordered list (up to ~8) of typed items, so any
 * header is just data. Each item is one of:
 *   { type: "icon",     icon, label, onClick, variant?, theme?, badge? }   icon-only Button
 *   { type: "dropdown", label, icon?, onClick, variant? }                  text + chevron Button
 *   { type: "cta",      label, icon?, variant?, theme?, onClick, menu? }   Button (split if menu)
 *   { type: "avatar",   src?, name?, ring? }                               profile avatar
 *   { type: "tutorial", onClick }                                          play-circle button
 *   { type: "divider" }                                                    vertical gradient rule
 *   { type: "node",     node }                                             custom
 *     icon — TP library icon NAME (string) or a ReactNode.
 *
 * Props: back, onBack, logo, user, title, leading, actions, height (default 62),
 *        bordered (default true), className.
 */

import * as React from "react";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Header.module.scss";

const icon = (g, size = 20) => (typeof g === "string" ? <TPLibraryIcon name={g} size={size} /> : g);

function Chevron({ dir = "down", size = 18 }) {
  const d = dir === "left" ? "m15 18-6-6 6-6" : "m6 9 6 6 6-6";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function TutorialButton({ onClick }) {
  return (
    <button type="button" className={styles.tutorial} aria-label="Play tutorial" onClick={onClick}>
      <svg width="42" height="42" viewBox="0 0 48 48" fill="none" aria-hidden>
        <circle cx="24" cy="24" r="21" stroke="#8A4DBB" strokeWidth="3.5" fill="none" />
        <circle cx="24" cy="24" r="15" fill="#8A4DBB" />
        <path d="M20.5 15L33 24L20.5 33V15Z" fill="white" />
      </svg>
    </button>
  );
}

function Avatar({ src, name, ring = true }) {
  const inner = src
    ? <img src={src} alt={name || "User"} className={styles.avatarImg} />
    : <span className={styles.avatarFallback}>{(name || "?").trim().charAt(0).toUpperCase()}</span>;
  return (
    <button type="button" className={cn(styles.avatar, ring && styles.avatarRing)} aria-label={name || "Profile"}>
      <span className={styles.avatarInner}>{inner}</span>
    </button>
  );
}

function UserBlock({ name, meta, avatar, dropdown }) {
  return (
    <button type="button" className={styles.user} aria-haspopup={dropdown ? "menu" : undefined}>
      {avatar !== false && (
        <span className={styles.userAvatar}>
          {typeof avatar === "string"
            ? <img src={avatar} alt={name} className={styles.avatarImg} />
            : avatar || <TPLibraryIcon name="profile" variant="bulk" size={22} color="var(--tp-slate-600, #717179)" />}
        </span>
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

function Action({ item }) {
  switch (item.type) {
    case "divider":
      return <span className={styles.divider} aria-hidden />;
    case "tutorial":
      return <TutorialButton onClick={item.onClick} />;
    case "avatar":
      return <Avatar src={item.src} name={item.name} ring={item.ring} />;
    case "icon":
      return (
        <span className={styles.iconWrap}>
          <Button
            className={styles.iconBtn}
            icon={icon(item.icon)}
            aria-label={item.label}
            variant={item.variant || "tonal"}
            theme={item.theme || "neutral"}
            size="md"
            onClick={item.onClick}
            style={{ width: 42, height: 42 }}
          />
          {item.badge && (
            <span className={styles.dot}>
              <Badge variant="dot" color={item.badge.color || "error"} size="md" />
            </span>
          )}
        </span>
      );
    case "dropdown":
      return (
        <Button
          variant={item.variant || "tonal"}
          theme="neutral"
          size="md"
          leftIcon={item.icon ? icon(item.icon) : undefined}
          rightIcon={<Chevron />}
          onClick={item.onClick}
          style={{ height: 42 }}
          className={styles.dropBtn}
        >
          <span className={styles.dropLabel}>{item.label}</span>
        </Button>
      );
    case "node":
      return item.node ?? null;
    case "cta":
    default:
      return (
        <Button
          variant={item.variant || "solid"}
          theme={item.theme || "primary"}
          size="md"
          leftIcon={item.icon && !item.menu ? icon(item.icon) : undefined}
          icon={item.icon && item.menu ? icon(item.icon) : undefined}
          menu={item.menu}
          onClick={item.onClick}
          style={{ height: 42 }}
        >
          {item.label}
        </Button>
      );
  }
}

export function Header({ back, onBack, logo, user, title, leading, actions = [], height = 62, bordered = true, className }) {
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
        {title != null && <div className={styles.title}>{title}</div>}
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
