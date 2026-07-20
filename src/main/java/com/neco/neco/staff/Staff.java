package com.neco.neco.staff;

import com.neco.neco.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff extends BaseEntity {

    @Column(name = "staff_id", unique = true, nullable = false, length = 20)
    private String staffId;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(length = 100)
    private String designation;

    @Column(length = 100)
    private String department;

    @Column(length = 100)
    private String division;

    @Column(length = 100)
    private String role;

    @Column(length = 50)
    private String category;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(length = 150)
    private String email;

    @Column(name = "passport_photo", length = 500)
    private String passportPhoto;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", length = 20)
    private AccountStatus accountStatus = AccountStatus.ACTIVE;

    public enum AccountStatus {
        ACTIVE, INACTIVE
    }
}
