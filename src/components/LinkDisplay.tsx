import type { Link, Tag } from "../../prisma/generated/prisma/client";
import { Edit3, Link as LinkIcon } from "lucide-react";
import styles from "./LinkDisplay.module.css";
import TagComponent from "./Tag";

export interface LinkWithTags extends Link {
  tags: Tag[];
}

export interface LinkDisplayProps {
  link: LinkWithTags;
  activeTags?: string[];
  canShare?: boolean;
  canEdit?: boolean;
  onLinkClick?: () => void;
  onTagClick?: (tag: string) => void;
}

export default function LinkDisplay({
  link,
  activeTags,
  canShare,
  canEdit,
  onLinkClick,
  onTagClick,
}: LinkDisplayProps) {
  const shouldShowIcons = canShare || canEdit;

  return (
    <div className="card" style={{ viewTransitionName: `link-${link.id}` }}>
      <a
        href={link.url}
        target="_blank"
        rel="noreferrer nofollow"
        className={`text-link ${styles.url}`}
        style={{ viewTransitionName: `link-${link.id}-link` }}
        onClick={onLinkClick}
      >
        {link.url}
      </a>
      <div className={styles.body}>
        <div className={styles.details}>
          {link.description && (
            <p
              className={styles.description}
              style={{ viewTransitionName: `link-${link.id}-description` }}
            >
              {link.description}
            </p>
          )}
          <ul className="tag-list">
            {link.tags.map((tag) => (
              <li
                key={tag.id}
                style={{ viewTransitionName: `link-${link.id}-tag-${tag.id}` }}
              >
                <TagComponent
                  component="button"
                  name={tag.name}
                  disabled={!onTagClick}
                  state={activeTags?.includes(tag.name) ? "active" : "inactive"}
                  onClick={onTagClick && (() => onTagClick(tag.name))}
                />
              </li>
            ))}
          </ul>
        </div>
        {shouldShowIcons && (
          <div className={styles.actions}>
            {canShare && (
              <a className={styles.action} href={`/links/${link.id}`}>
                <LinkIcon className={styles.icon} aria-label="Permalink" />
              </a>
            )}
            {canEdit && (
              <a className={styles.action} href={`/links/${link.id}/edit`}>
                <Edit3 className={styles.icon} aria-label="Edit link" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
