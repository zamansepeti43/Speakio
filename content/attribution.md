# Speakio — Third-party content attribution

## Tatoeba

Speakio may use selected English–Turkish example sentences from Tatoeba when the individual sentence and its license have been verified.

- Project: Tatoeba
- Data license for general downloadable datasets: CC BY 2.0 FR
- Some sentences are additionally available under CC0 1.0
- Audio licenses are contributor-specific and must be checked separately
- Official data/download page: https://tatoeba.org/en/downloads
- Official API: https://api.tatoeba.org/

### Product rule

Do not bulk-copy Tatoeba content into production without retaining attribution metadata. For each imported sentence keep at minimum:

- source = Tatoeba
- sourceSentenceId
- sourceLanguage
- targetLanguage
- license
- attributionUrl

If a sentence does not have an acceptable license for the intended product use, it must not enter the production content bundle.

## Important

This file is a product-side attribution policy, not legal advice. Before commercial release, the final imported dataset should be reviewed against the current licenses and the exact intended distribution model.
