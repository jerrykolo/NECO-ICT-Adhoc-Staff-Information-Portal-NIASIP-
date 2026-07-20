package com.neco.neco.announcement;

import com.neco.neco.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "announcements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Announcement extends BaseEntity {

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "published_at")
    private java.sql.Timestamp publishedAt;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;
}
