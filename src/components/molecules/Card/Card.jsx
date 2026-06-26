"use client";

/**
 * Card — the default surface container (dashboards, patient tiles, vitals panels).
 *
 * Compound parts (all optional, compose freely):
 *   Card · CardHeader · CardTitle · CardDescription · CardContent · CardFooter
 *
 *   <Card variant="elevated">
 *     <CardHeader>
 *       <CardTitle>Vitals</CardTitle>
 *       <CardDescription>Last recorded 2h ago</CardDescription>
 *     </CardHeader>
 *     <CardContent>…</CardContent>
 *     <CardFooter>…</CardFooter>
 *   </Card>
 *
 * Props (Card):
 *   variant   "default" | "outline" | "elevated"   surface treatment (default "default")
 *   padding   "none" | "sm" | "md" | "lg"          inner padding scale (default "md")
 *   radius    number | "pill" | "sharp" | string   corner override (else token)
 *   tone      "neutral" | "primary" | "success" | "warning" | "error" | "violet"
 *             accent for the gradient / left-accent treatments (default "neutral")
 *   gradient  boolean — fill with a branded gradient in `tone` + light text
 *             (for hero / highlight tiles). For texture, drop an <AnimatedGrid />
 *             in as a child — that's the only sanctioned overlay.
 *   background  any CSS background (token/colour/gradient) — custom override
 *   interactive boolean — hover lift + pointer (clickable cards)
 *   className, style, …rest (spread to root)
 */

import * as React from "react";
import { resolveRadius, cn } from "@/src/hooks/utils";
import styles from "./Card.module.scss";

export const Card = React.forwardRef(function Card(
  { variant = "default", padding = "md", radius, tone = "neutral", gradient = false, background, interactive = false, className, style, children, ...rest },
  ref,
) {
  const r = resolveRadius(radius);
  const cardStyle = {
    ...(r != null ? { "--card-radius": r } : null),
    ...(background ? { "--card-bg": background } : null),
    ...style,
  };
  return (
    <div
      ref={ref}
      className={cn(styles.card, className)}
      data-variant={variant}
      data-padding={padding}
      data-tone={tone !== "neutral" ? tone : undefined}
      data-gradient={gradient ? "" : undefined}
      data-interactive={interactive ? "" : undefined}
      style={Object.keys(cardStyle).length ? cardStyle : undefined}
      {...rest}
    >
      {children}
    </div>
  );
});

export const CardHeader = React.forwardRef(function CardHeader({ className, children, ...rest }, ref) {
  return <div ref={ref} className={cn(styles.header, className)} {...rest}>{children}</div>;
});

export const CardTitle = React.forwardRef(function CardTitle({ as: Tag = "h3", className, children, ...rest }, ref) {
  return <Tag ref={ref} className={cn(styles.title, className)} {...rest}>{children}</Tag>;
});

export const CardDescription = React.forwardRef(function CardDescription({ className, children, ...rest }, ref) {
  return <p ref={ref} className={cn(styles.description, className)} {...rest}>{children}</p>;
});

export const CardContent = React.forwardRef(function CardContent({ className, children, ...rest }, ref) {
  return <div ref={ref} className={cn(styles.content, className)} {...rest}>{children}</div>;
});

export const CardFooter = React.forwardRef(function CardFooter({ className, children, ...rest }, ref) {
  return <div ref={ref} className={cn(styles.footer, className)} {...rest}>{children}</div>;
});

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export default Card;
