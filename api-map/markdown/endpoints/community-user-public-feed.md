# community-user-public-feed

Mutation: no
Risk: read
Method: GET
Path: `/api/alltrails/community/blazes/v0/users/{user_id}/feeds/public`
Surface: community
Requires Auth: yes
Requires Subscription: no
Labels: browser_observed
Evidence: sanitized Chrome CDP capture 2026-05-26

Public feed route for a user; observed with requested feed-item version query keys.
