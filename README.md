# CertiChain certificate verifier

A responsive, dependency-free certificate verification UI prototype with separate Verify, Certificates, Insights, About, and Verification result views.

## Run locally

Start a static server from this folder:

```sh
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Mock certificate records

The app includes 10 fictional certificate records in `app.js`:

- 6 verified
- 2 revoked
- 2 not verified

Try `CCH-2025-04821` (verified), `CCH-2024-01307` (revoked), or `CCH-2025-06712` (not verified). Other IDs show a not-found result. The Certificates and Insights dashboards use the same mock records.

These sample people, institutions, transaction references, blocks, and statuses are fictional. Verification is simulated locally; this prototype is not connected to a live blockchain or authoritative certificate registry. File fingerprinting computes a SHA-256 hash in the browser and does not upload the file or compare it to an on-chain record.
