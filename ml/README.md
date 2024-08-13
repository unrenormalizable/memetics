# memetics - ML pipeline

Pipeline: 
o Design Principles
  - Pure
  - Idempotent
  - Incremental
o Steps
  v Make consistent name
  o Preprocess pics 
    x Make all jpeg
    ? Make less than 800x800
    - Generate thumb-nails
  o Extract text
    v call keras-ocr
    - remove less than 2 letter words, non english characters
    - remove non valid words
  v Generate index.json
  o Upload pic / thumbnail / images to azure
    o manual
    - automate

Note:
- Using WSL / GPU stuff. TF/Keras on GPU doesn't seem to work otherwise.
- ```nb-clean clean *.ipynb -e -M```

References:
- [keras-ocr](https://github.com/faustomorales/keras-ocr)
- [Extract text top-down left-right](https://github.com/shegocodes/keras-ocr)
