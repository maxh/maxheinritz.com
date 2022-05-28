---
title: Validation issues
layout: note
---

Data validation ensures that input provided by a user is acceptable from both a technical and business perspective. For example, a user registration system may include validations to ensure that each user has a non-empty first name and last name and that each user's email address is unique and formatted properly.

## Validation issues vs errors

Issues discovered during validation are called "validation issues" rather than "errors" because they are different from programming language "errors" in several ways.

### Fixable by end users

End users can fix validation issues by editing the input they provide to the system. This could be done either in a UI form (in the case of a web or mobile user) or changing their API request (in the case of an API user). In contrast, system errors such as "failed to connect to database" are not fixable by users.

### Expected to occur

Validation issues are expected to occur periodically during the normal usage of the app, whereas system errors are generally not. User input is unpredictable by nature.

### Human readable

The messages associated with validation issues are expected to be displayed to end users and should be human-readable.

### Multiple at once
There may be multiple validation issues during a single mutation. To the extent possible, all validation issues should be reported back to the user at once. We should not "throw" or "abort" upon the first validation issue.

### GraphQL data
In GraphQL, validation issues are included in the "data" part of the response rather than the "errors" part of the response.

Validation issues are not instances of the JavaScript "Error" class.

## Where to validate

Validations may be checked at the database level with uniqueness constraints or foreign key constraints. Validations may also be checked in backend application code at run time. And in some cases the frontend may generate validation issues on the client to prove faster user feedback. (Frontend validation can be added in addition to backend validation but is not a replacement).