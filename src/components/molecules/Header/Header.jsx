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
 * Props: back, onBack, backIcon (default "arrow-left3"),
 *        backIconVariant (default "linear"), backIconCorner (default "straight"),
 *        backDivider (default true — vertical rule after the back button when the
 *          left cluster has following content: the standard back · | · content look),
 *        logo, user, title, subtitle, leading, actions,
 *        height (default 62), bordered (default true), className.
 *
 * Configurability:
 *   align       "left" (default) | "center" — center the title (MD3 center-aligned
 *               top app bar): back/logo/user on the left, title centered, actions right.
 *   search      { placeholder?, value?, onChange?, width? } — a first-class search
 *               field in the bar (pill InputBox with a search glyph).
 *   maxVisibleActions  number — actions past this count roll into a "More" overflow
 *               menu, so a crowded bar stays on one line at narrow widths.
 *   density     "comfortable" (default) | "compact" — scales the control sizes
 *               (CTA / info / avatar 42px → 36px) and the bar padding/gap together.
 *   sticky      boolean — position: sticky; top: 0 (default false).
 *   elevation   boolean | "always" | "onScroll" — drop shadow under the bar.
 *               "onScroll" shows the shadow only after the page scrolls (default false).
 *   trailing    ReactNode — free-form right content after the `actions` array.
 *   background  token-driven surface override (default --tesseract-slate-0).
 *   borderColor token-driven bottom-border colour (default --tesseract-slate-100).
 *   onUserClick wires the user block's click (default no-op).
 *   tutorialIcon icon name | node — replaces the default play glyph in a
 *               `tutorial` action (default: the violet play-circle).
 *
 * The back button is a small, control-sized icon button using the standard back
 * affordance (arrow-left3, straight corner) — not a full-height bordered cell.
 */

import * as React from "react";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { Avatar } from "@/src/components/atoms/Avatar";
import { Divider } from "@/src/components/atoms/Divider";
import { Dropdown } from "@/src/components/molecules/Dropdown";
import { Menu, MenuTrigger, MenuContent, MenuItem } from "@/src/components/molecules/Menu";
import { InputBox } from "@/src/components/atoms/Input/InputBox";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Header.module.scss";

const icon = (g, size = 20) => (typeof g === "string" ? <TPLibraryIcon name={g} size={size} /> : g);

// Chevrons come from the Iconsax library, like every other icon. The back/left
// glyph defaults to the standard back affordance (arrow-left3 in the straight
// corner variant) and can be overridden (name + style + corner) by Header props.
function Chevron({ dir = "down", size = 18, name, variant = "linear", corner = "rounded" }) {
  const glyph = name ?? (dir === "left" ? "arrow-left-02" : "arrow-down-02");
  return <TPLibraryIcon name={glyph} variant={variant} corner={corner} size={size} />;
}

// Title (+ optional subtext) — shared by the left cluster and the centered slot.
function TitleBlock({ title, subtitle }) {
  return (
    <div className={styles.titleBlock}>
      <div className={styles.title}>{title}</div>
      {subtitle != null && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  );
}

// Overflow "More" menu — actions past `maxVisibleActions` roll into a single
// action menu so a crowded bar stays on one line at narrow widths. Composes the
// shared Menu primitive (proper menu/menuitem semantics, not a value select).
function OverflowMenu({ items }) {
  return (
    <Menu>
      <MenuTrigger asChild>
        <Button
          variant="tonal"
          theme="neutral"
          leftIcon={<TPLibraryIcon name="more" size={18} />}
          style={{ height: "var(--tesseract-header-control)" }}
        >
          More
        </Button>
      </MenuTrigger>
      <MenuContent align="end">
        {items.map((a, i) => (
          <MenuItem key={a.key ?? i} icon={a.icon} onSelect={() => a.onClick?.()}>
            {a.label ?? a.value ?? "Action"}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  );
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

export const Header = React.forwardRef(function Header({
  back, onBack, backIcon = "arrow-left3", backIconVariant = "linear", backIconCorner = "straight", backDivider = true,
  logo, user, title, subtitle, leading, actions = [],
  align = "left", search, maxVisibleActions,
  height = 62, bordered = true, density = "comfortable",
  sticky = false, elevation = false, trailing,
  background, borderColor, onUserClick, tutorialIcon, className, style: styleProp,
  ...rest
}, ref) {
  // Merge the per-Header tutorialIcon onto any `tutorial` action that doesn't set its own.
  const resolved = tutorialIcon != null
    ? actions.map((a) => (a && a.type === "tutorial" && a.icon == null ? { ...a, icon: tutorialIcon } : a))
    : actions;

  const controlPx = density === "compact" ? 36 : 42;
  const centered = align === "center";

  // Elevation: boolean / "always" → static shadow; "onScroll" → shadow appears
  // only after the page scrolls past the bar (the expected modern behavior).
  const elevationMode = elevation === true || elevation === "always" ? "always"
    : (elevation === "onScroll" || elevation === "scroll") ? "scroll" : "none";
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    if (elevationMode !== "scroll" || typeof window === "undefined") return undefined;
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [elevationMode]);
  const elevated = elevationMode === "always" || (elevationMode === "scroll" && scrolled);

  // Responsive overflow: actions past maxVisibleActions roll into a "More" menu.
  const hasOverflow = typeof maxVisibleActions === "number" && resolved.length > maxVisibleActions;
  const visibleActions = hasOverflow ? resolved.slice(0, maxVisibleActions) : resolved;
  const overflowActions = hasOverflow ? resolved.slice(maxVisibleActions) : [];

  const style = { height, ...styleProp };
  if (background) style["--tesseract-header-bg"] = background;
  if (borderColor) style["--tesseract-header-border"] = borderColor;

  const searchSlot = search ? (
    <div className={styles.search} style={search.width ? { width: search.width } : undefined}>
      <InputBox
        size={density === "compact" ? "sm" : "md"}
        placeholder={search.placeholder || "Search…"}
        value={search.value}
        onChange={search.onChange}
        leftIcon={<TPLibraryIcon name="search:search-2" size={18} />}
        radius="pill"
        fullWidth
      />
    </div>
  ) : null;

  return (
    <header
      ref={ref}
      className={cn(styles.header, className)}
      data-bordered={bordered || undefined}
      data-density={density === "compact" ? "compact" : undefined}
      data-align={centered ? "center" : undefined}
      data-sticky={sticky || undefined}
      data-elevation={elevationMode !== "none" ? elevationMode : undefined}
      data-elevated={elevated || undefined}
      style={style}
      {...rest}
    >
      <div className={styles.left}>
        {back && (
          (backDivider && (logo != null || user || (!centered && title != null) || leading != null)) ? (
            // 80px left column (aligns with the 80px secondary-sidebar rail): ghost
            // back button centred, solid full-height divider at the 80px mark.
            <div className={styles.backZone}>
              <button type="button" className={styles.back} aria-label="Go back" onClick={onBack}>
                <Chevron dir="left" size={20} name={backIcon} variant={backIconVariant} corner={backIconCorner} />
              </button>
            </div>
          ) : (
            <button type="button" className={styles.back} aria-label="Go back" onClick={onBack}>
              <Chevron dir="left" size={20} name={backIcon} variant={backIconVariant} corner={backIconCorner} />
            </button>
          )
        )}
        {logo != null && <div className={styles.logo}>{logo}</div>}
        {user && <UserBlock {...user} onClick={user.onClick || onUserClick} />}
        {!centered && title != null && <TitleBlock title={title} subtitle={subtitle} />}
        {leading}
        {!centered && searchSlot}
      </div>

      {centered && (title != null || searchSlot) && (
        <div className={styles.center}>
          {title != null ? <TitleBlock title={title} subtitle={subtitle} /> : searchSlot}
        </div>
      )}

      <div className={styles.actions}>
        {visibleActions.map((item, i) => <Action key={item.key ?? i} item={item} controlPx={controlPx} />)}
        {overflowActions.length > 0 && <OverflowMenu items={overflowActions} />}
        {trailing}
      </div>
    </header>
  );
});

Header.displayName = "Header";
export default Header;
