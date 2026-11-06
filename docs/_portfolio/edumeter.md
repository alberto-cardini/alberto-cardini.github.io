---
title: "EduMeter: Designing a Course-Review System"
card_title: "EduMeter"
slug: edumeter
order: 4
category: "Software engineering"
technologies: "Java 17 · Jakarta REST · PostgreSQL · JUnit"
summary: "A review-platform backend with a relational domain model, moderated publication, interchangeable persistence layers and systematic testing."
description: "A review-platform backend with a relational domain model, moderated publication, interchangeable persistence layers and systematic testing."
---

## Problem and project scope

Choosing an elective course often means working with incomplete information about workload, examination format and teaching. EduMeter addresses this information gap through a proposed review platform for University of Florence students. Its central engineering problem is how to collect useful feedback while maintaining a coherent catalogue of courses and professors.

The project includes a Java backend, REST API, PostgreSQL schema, authentication-related components, tests and a detailed software-engineering report. **The frontend is represented by mockups, and email delivery is not implemented.** This is a backend and system-design project, not a claim of an operating public review service.

## Requirements and the catalogue problem

The report distinguishes three actors. Guests browse and filter published reviews without logging in. Students are intended to authenticate with institutional email, submit reviews, vote on helpful entries and report inappropriate content. Administrators manage catalogue records, moderate reports and verify new teaching entries.

A review refers to a **teaching**, the relationship between a course and a professor. Courses belong to degrees, and degrees belong to schools. The review carries enjoyment and difficulty ratings plus a qualitative comment. Separating these entities avoids duplicating catalogue information in every published review.

The team considered direct institutional integration, scraping the external course catalogue and manually hardcoding all records. Institutional integration would require authorization and raise privacy concerns; scraping was considered too expensive to build and maintain within scope; manual entry did not scale. The chosen design lets students contribute missing entries while an administrator verifies them.

## Publication workflow and data model

Existing, verified teachings and newly supplied teaching details take different paths. A review associated with a known teaching can be published directly. A submission introducing new school, degree, course or professor information becomes a draft. An administrator resolves the catalogue data and publishes it against a verified teaching identifier.

<div class="demo"><h3>Explore the publication decision</h3><label for="review-route">Teaching selected by the student</label> <select id="review-route"><option value="known">An existing verified teaching</option><option value="new">New teaching details entered manually</option></select><p id="review-explanation" class="demo-output" aria-live="polite">Existing teaching → validate the review → publish against its teaching ID. The submission reuses verified catalogue records.</p><p class="small">Interactive explanation of the report’s workflow, not a connection to a live review service.</p></div>

| Entity or relation | Purpose |
|---|---|
| School → Degree → Course | Hierarchical catalogue organization |
| Teaching | Association between professor and course |
| Draft review | Raw catalogue text awaiting resolution |
| Published review | Review tied to an existing teaching ID |
| User / Admin | Student identity state and administrator records |
| PIN challenge | Authentication challenge with an expiration time |
| Up-vote / Report | Community feedback and moderation requests |

The distinction between draft and published reviews is reflected in separate model classes and persistence operations. Referential relationships in PostgreSQL connect published reviews to teachings and users. This makes moderation a state transition with data-integrity consequences, rather than a cosmetic visibility toggle.

## Architecture and implementation

The code separates **business logic**, **domain models** and **persistence**. REST endpoint classes use Jakarta REST annotations to map HTTP operations to methods. Jersey provides the REST implementation, Jackson handles JSON serialization and deserialization, and dependency injection supplies DAO interfaces. Maven targets Java 17 and packages a WAR for deployment in a compatible servlet environment.

Persistence is exposed through DAO interfaces and factories. There are two implementations: an in-memory store for lightweight execution and tests, and PostgreSQL-backed DAOs using JDBC. The environment variable `IN_MEM_DB` selects in-memory operation when set; otherwise the application reads database connection configuration from the environment.

| Request stage | Main responsibility |
|---|---|
| HTTP / Jersey | Route the request and apply authentication filters |
| Endpoint and domain layer | Validate operations and work through DAO interfaces |
| Persistence | Store and retrieve through in-memory or PostgreSQL implementations |
| Response | Serialize the result or error as JSON |

This architecture lets endpoint tests substitute mocks and exercise response branches without requiring a database. Database integration tests can independently validate actual SQL behaviour. Exception handlers centralize JSON error responses for invalid formats, parsing errors and application exceptions.

### Authentication and authorization boundaries

The intended login flow validates an institutional email domain, creates a short-lived PIN challenge and issues a token after successful verification. `AuthGuard` and `AdminGuard` annotations connect endpoints to request filters. `CryptoService` handles HMAC-derived user identifiers, token generation, verification and revocation. The report describes public anonymity of reviews; that should be understood as pseudonymous application identity, not a proof of irreversible anonymity.

The current `AuthEndpoints` source validates challenge expiry and PIN equality and checks whether a user is banned. However, challenge generation uses a fixed development PIN and the email-send operation is only a comment. The README also contains older testing-oriented authentication notes, so the current source is the more precise description of implemented checks.

Before production use, this flow needs random one-time codes, actual delivery, stronger abuse controls and an authorization review. In particular, the login implementation accepts an administrator-mode parameter; its relationship to the stored challenge role must be enforced. These limitations are part of the engineering discussion rather than claims of production-ready security.

## Interface design

The report includes mobile-oriented mockups for browsing, login, review entry and administration. They demonstrate the intended interaction flow while remaining separate from implemented backend functionality. The browsing view exposes course and instructor context before the user commits to reading or posting a review.

<figure><img class="mockup" src="{{ '/assets/images/edumeter-mockup.webp' | relative_url }}" alt="Original EduMeter mobile browsing interface mockup from the software-engineering report" loading="lazy"><figcaption>Original browsing mockup from the report. This is an interface design artifact, not a screenshot of a deployed frontend.</figcaption></figure>

## Testing and reported coverage

The report combines unit tests with PostgreSQL integration tests. JUnit Jupiter supplies the test framework; Mockito isolates dependencies. Endpoint tests cover successful requests, missing objects, invalid input and permission-related failures. A package-private clock setter in `CryptoService` allows token expiration to be tested deterministically.

PostgreSQL DAO tests use Testcontainers with PostgreSQL 16. A shared base class starts a disposable database, loads `init.sql`, and clears tables between tests using `TRUNCATE … RESTART IDENTITY CASCADE`. Fixed fixtures then keep tests independent and reproducible. The report describes manual HTTP-level exploration with Insomnia rather than claiming a comprehensive automated end-to-end browser test suite.

| Package | Reported line coverage |
|---|---:|
| Authentication service | 87% (47/54) |
| Authentication filters | 100% (27/27) |
| REST endpoints | 100% (206/206) |
| Exception handlers | 100% (30/30) |
| Domain models | 86.1% (161/187) |
| In-memory DAOs | 88.9% (304/342) |
| PostgreSQL DAOs | 83.9% (348/415) |

These numbers are transcribed from the report’s combined unit/integration coverage table; they are not a fresh coverage measurement. Line coverage shows which code was exercised, not that all security properties, concurrent behaviours or user journeys were verified.

## Discussion and next steps

The most important design trade-off is between catalogue completeness and administrative work. Crowdsourcing reduces dependence on external systems, but new entries can become bottlenecked by moderation. Separating raw submissions from verified catalogue references protects data quality at the cost of a longer publication path.

The DAO boundary provides a useful testing seam, but mocks cannot reproduce all database constraints or transaction behaviour. Integration tests therefore play a distinct role. A next iteration should complete the frontend and delivery service, harden authentication and authorization, verify moderation transactions, and test concurrent voting and publication. Load testing and user evaluation would be needed before making scalability or usability claims.

## References and resources

<div class="resource-box" markdown="1">
[Read the full technical report (LaTeX source)](https://github.com/alberto-cardini/EduMeter/blob/main/report/main.tex)

[Complete report sections and figures](https://github.com/alberto-cardini/EduMeter/tree/main/report) · [GitHub repository](https://github.com/alberto-cardini/EduMeter) · [Test suite](https://github.com/alberto-cardini/EduMeter/tree/main/src/test)

The public repository contains the full report source, including requirements, use cases, architecture, implementation details, testing and API documentation. A compiled report PDF was not present in the inspected tree.
</div>
