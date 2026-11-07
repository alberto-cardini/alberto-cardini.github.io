---
title: "EduMeter: Designing a Course-Review System"
card_title: "EduMeter"
slug: edumeter
order: 4
category: "Software engineering"
technologies: "Java 17 · Jakarta REST · PostgreSQL · JUnit"
summary: "Developing a university course-review backend with REST APIs, a relational data model and automated testing."
description: "A collaborative software-engineering project covering backend architecture, review moderation, persistence and testing."
---

EduMeter is a university course-review platform that I developed with Lorenzo Bellina and Carolina Cecchi as a software-engineering project at the University of Florence. We wanted to help students make more informed course choices by organizing feedback about teaching, workload and difficulty. Our work covered requirements analysis, domain and database modelling, a Java REST backend, authentication-related functionality, interface mockups and automated testing; the frontend itself remained at the design stage.

## Design and architecture

One of our main challenges was maintaining a consistent academic catalogue without relying on direct access to university systems. We modelled schools, degrees, courses, professors and teachings as distinct entities, with each review associated with a specific course–professor pairing. We also designed a moderation workflow in which reviews referencing known teachings can be published, while submissions introducing new catalogue information are held as drafts for administrative verification. This preserves referential integrity while allowing students to expand the catalogue over time.

<div class="demo">
  <h3>Explore the publication decision</h3>
  <label for="review-route">Teaching selected by the student</label>
  <select id="review-route">
    <option value="known">An existing verified teaching</option>
    <option value="new">New teaching details entered manually</option>
  </select>
  <p id="review-explanation" class="demo-output" aria-live="polite">Existing teaching → validate the review → publish against its teaching ID. The submission reuses verified catalogue records.</p>
  <p class="small">An interactive illustration of the publication workflow, not a live service.</p>
</div>

We implemented the backend in Java 17 using Jakarta REST and Jersey, with Jackson for JSON handling and DAO interfaces separating application logic from persistence. Two DAO implementations allow the application to run with either an in-memory store or PostgreSQL via JDBC. This abstraction made components easier to test in isolation and reduced their dependence on database details. We also implemented authentication and authorization components, although email delivery and production-grade one-time PIN generation were outside the completed prototype.

<figure>
  <img class="mockup" src="{{ '/assets/images/edumeter-mockup.webp' | relative_url }}" alt="EduMeter mobile interface mockup" loading="lazy">
  <figcaption>Mobile interface concept developed for the course-review platform.</figcaption>
</figure>

## Testing and results

Testing was a central part of the project. We used JUnit and Mockito for unit tests and Testcontainers with PostgreSQL 16 for integration tests, checking both API behaviour and database operations. The combined test suite achieved 100% reported line coverage for REST endpoints, authentication filters and exception handlers, with substantial coverage of the remaining components.

| Component | Reported line coverage |
|---|---:|
| REST endpoints | 100% (206/206) |
| Authentication filters | 100% (27/27) |
| Exception handlers | 100% (30/30) |
| Domain models | 86.1% (161/187) |
| In-memory DAOs | 88.9% (304/342) |
| PostgreSQL DAOs | 83.9% (348/415) |

## Outcome and resources

EduMeter allowed us to work through the main stages of software engineering, from modelling requirements to implementing and testing a modular backend. I particularly value the architectural decisions behind the review-publication workflow and interchangeable persistence layers. The result is a well-tested backend prototype and a foundation for a future full application, rather than a deployed public service.

<div class="resource-box" markdown="1">

Developed in collaboration with Lorenzo Bellina and Carolina Cecchi.

[Technical report (LaTeX)](https://github.com/alberto-cardini/EduMeter/blob/main/report/main.tex) · [GitHub repository](https://github.com/alberto-cardini/EduMeter) · [Test suite](https://github.com/alberto-cardini/EduMeter/tree/main/src/test)

</div>
