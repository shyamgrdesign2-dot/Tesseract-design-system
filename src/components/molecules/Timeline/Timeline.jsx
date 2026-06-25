"use client";

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import styles from "./Timeline.module.scss";

/**
 * Timeline / TimelineItem — a vertical event timeline (visit history, audit log,
 * plan progress). Each item shows a connector line + node dot on the left and a
 * card on the right with a title, an optional date pill, a right-aligned action
 * slot, and any body content (clinical notes, etc.). Drop it inside a SectionCard
 * body for the plan visit-timeline pattern.
 *
 *   <Timeline tone="violet">
 *     <TimelineItem title="Dr. Sheela B R" date="10 Apr 2026" action={<Button>View Rx</Button>}>
 *       <strong>Clinical Notes:</strong> Canal shaping + obturation completed
 *     </TimelineItem>
 *   </Timeline>
 *
 * Timeline props: tone ("violet" | "primary" | "success" | "neutral"), className.
 * TimelineItem props: title, date, dateIcon, action, tone (override), muted
 * (hollow node, e.g. a skipped/rescheduled entry), className, children (body).
 */
const TimelineCtx = React.createContext({ tone: "violet" });

export const Timeline = React.forwardRef(function Timeline({ tone = "violet", className, children, ...rest }, ref) {
  const ctx = React.useMemo(() => ({ tone }), [tone]);
  return (
    <TimelineCtx.Provider value={ctx}>
      <div ref={ref} className={cn(styles.timeline, className)} {...rest}>
        {children}
      </div>
    </TimelineCtx.Provider>
  );
});

export const TimelineItem = React.forwardRef(function TimelineItem(
  { title, date, dateIcon = "calendar-1", action, tone: toneProp, muted = false, className, children, ...rest },
  ref,
) {
  const ctx = React.useContext(TimelineCtx);
  const tone = toneProp ?? ctx.tone ?? "violet";
  return (
    <div ref={ref} className={cn(styles.item, className)} data-tone={tone !== "violet" ? tone : undefined} {...rest}>
      <span className={styles.rail} aria-hidden="true" />
      <span className={cn(styles.node, muted && styles.nodeMuted)} aria-hidden="true" />
      <div className={styles.card}>
        {(title != null || date != null || action != null) && (
          <div className={styles.head}>
            <div className={styles.headMain}>
              {title != null && <p className={styles.title}>{title}</p>}
              {date != null && (
                <span className={styles.datePill}>
                  {dateIcon && <TPLibraryIcon name={dateIcon} variant="linear" size={13} />}
                  <span>{date}</span>
                </span>
              )}
            </div>
            {action != null && <div className={styles.action}>{action}</div>}
          </div>
        )}
        {children != null && <div className={styles.body}>{children}</div>}
      </div>
    </div>
  );
});

Timeline.displayName = "Timeline";
TimelineItem.displayName = "TimelineItem";
export default Timeline;
