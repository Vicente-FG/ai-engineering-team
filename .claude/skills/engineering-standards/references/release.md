# Release and Delivery

Rules for shipping, rolling out and proving what you ship. Entry format: ID, one-line instruction, the source it comes from, and the concrete check to perform.

### FF-FEATURE | Implement feature flags as temporary, removable branches that are cleaned up after rollout
- Source: Feature Flag (Martin Fowler)
- URL: https://martinfowler.com/bliki/FeatureFlag.html
- Authority: Fowler's bliki entry for the pattern, including its warning that flags are technical debt and must be removed
- Version/date: 29 October 2010
- Verified on: 2026-11-05
- Apply when: introducing a flag — record an owner and an expiry, wrap the flag in an abstraction with a default, and confirm a cleanup ticket exists for the flag's removal after the rollout completes

### BLUEGREEN | Deploy with two identical environments and switch traffic atomically so rollback is a route change
- Source: Blue Green Deployment (Martin Fowler)
- URL: https://martinfowler.com/bliki/BlueGreenDeployment.html
- Authority: Fowler's bliki entry describing the deployment pattern as implemented by the cloud platforms it inspired
- Version/date: 1 March 2010
- Verified on: 2026-11-05
- Apply when: planning a production release — confirm a green environment is kept warm and untrafficked, and that switching back is a configuration change with no rebuild

### CANARY | Release to a small slice of traffic first and compare error and latency metrics before widening
- Source: Canary Release (Martin Fowler)
- URL: https://martinfowler.com/bliki/CanaryRelease.html
- Authority: Fowler's bliki entry for the progressive-delivery pattern
- Version/date: 25 June 2014
- Verified on: 2026-11-05
- Apply when: releasing a risky change — confirm the rollout starts at a small traffic percentage with automated metric comparison and a defined abort threshold before the full rollout

### ARGO-ROLLOUTS | Drive progressive delivery with an Argo Rollout that automates canary/blue-green steps and automatic rollback
- Source: Argo Rollouts — Kubernetes Progressive Delivery
- URL: https://argo-rollouts.readthedocs.io/en/stable/
- Authority: the tool's own documentation, describing the Rollout resource, analysis templates and automatic abort/rollback behaviour
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: defining a deployment strategy in Kubernetes — confirm the Rollout resource declares the canary steps, the analysis template with its metric thresholds, and that a failed analysis triggers an automatic abort

### SBOM-CISA | Generate an SBOM for every release artifact and treat it as a release deliverable
- Source: Software Bill of Materials (SBOM) (CISA)
- URL: https://www.cisa.gov/topics/information-communications-technology-supply-chain-security/sbom
- Authority: CISA's official guidance and resource hub for SBOM generation and consumption, defining the artifact's expected content and formats
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: cutting a release — confirm an SBOM in a standard format (SPDX or CycloneDX) is produced by the build, stored with the release, and can be regenerated for a given artifact

### SIGSTORE | Sign release artifacts and attestations with Sigstore's keyless signing and verify them at deploy time
- Source: Overview — Sigstore
- URL: https://docs.sigstore.dev/
- Authority: Sigstore's own documentation for the CNCF keyless signing service, covering Fulcio, Rekor and the Cosign tooling
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: publishing a build artifact — sign it with the keyless workflow, publish the signature and transparency-log entry, and confirm the deploy step verifies the signature before running the image
