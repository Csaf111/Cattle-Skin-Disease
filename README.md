# Cattle Skin Disease

A web application and supporting machine-learning research workspace for identifying cattle skin disease from images. The repository combines a Vite-based client, server-side code, image fixtures, and a ResNet notebook.

## Repository map

```text
src/       Web client
server/    API/model-related code and training notebook
images/    Development image assets
```

## Local setup

1. Copy `.env.example` to `.env` and set local-only configuration values.
2. Install the JavaScript dependencies with `npm ci`.
3. Run the development command defined in `package.json`.
4. Follow the server-side dependencies and notebook requirements under `server/` before running model experiments.

Do not commit `.env`, model credentials, or production endpoints.

## Engineering scope

The project demonstrates an end-to-end disease-detection concept: a browser experience, image assets, and model experimentation. The notebook is research material, not a production inference pipeline.

## Limitations and next steps

- Validate datasets, class balance, and evaluation metrics before making health-related claims.
- Add an explicit API contract and repeatable environment setup for the server.
- Add tests for client validation and server responses.
- Add model versioning, reproducible training, and monitoring before deployment.
- Include a clinical/veterinary review process; this software must not be treated as a diagnostic authority.

## Security

See [SECURITY.md](SECURITY.md). Rotate every value previously stored in the tracked environment file.

## License

No license has been selected yet.