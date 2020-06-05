# Explainable Clinical Decision Support Systems Based on Bayesian Networks for Therapy Planning
This work addresses the high need for explainable Clinical Decision Support Systems (CDSS) in form of Bayesian networks (BN). Inspired by decison-making within clinical routine, our approach includes **patient-specific evidence items**, such as examination findings, age, and gender, in a ordered form regarding their relevance for out computed recommendation; shows **clinical guidelines and doctor's letters** to allow physicians in justifying the results; and assists in exploring the underlying BN, which is comparable to the **mental model** of physicians. Furthermore, we provide uncertainty-aware visualizations of the computed recommendation and provide interactive features for evidence item modification and addition.
The application can be seen in the following figure. 

![Overview](images/overview.png?raw=true "Title")

# Running the code
To run the application you need to do following steps:

- [ ] clone the github repository. URL: https://github.com/JulianeMu/explainable_cdss_for_therapy_planning.git
- [ ] create a BayesFusion account (https://www.bayesfusion.com/) and download the python 3.7 wrapper for SMILE. 
  - MacOS: pysmile-1.5.0-macosx-python-3.7-academic.tar.gz
  - Windows systems: pysmile-1.5.0-win-x64-python-3.7-academic.zip
  - Linux: pysmile-1.5.0-linux-x64-python-3.7-academic.tar.gz
- [ ] download the *pysmile_license.py* from the BayesFusion
- [ ] add the **pysmile wrapper**, e.g., pysmile.so for MacOS, and **pysmile_license.py** to the project like this:
![pysmile](images/pysmile.png?raw=true "Title")
- [ ] open the project in a development environment
- [ ] install all required python packages
- [ ] run the **app.py**
- [ ] run the **index.html** (located in the templates folder)
- [ ] have fun using our visual approach :) 

# Acknowledgements
The research leading to this work was supported by the German Federal Ministry of Education and Research (BMBF) (03Z1LN11) and the Federal State of Saxony-Anhalt (FKZ: I 88). We use the python wrapper from GeNIe SMILE to run the reasoning process. The BN provided as an example was developed by Reijnen et al.[1].

[1] Reijnen, C, Gogou, E, van der Putten, L, Visser, N, van de Vijver, K, Santacana, M, et al.  Development and validation of an endometrial carcinoma  preoperative  bayesian  network  using  molecular  and  clinical biomarkers (ENDORISK): an ENITEC collaboration study. International Journal of Gynecologic Cancer 2019;29(Suppl 4):A6–A7. doi: [10.1136/ijgc-2019-ESGO.7](https://ijgc.bmj.com/content/29/Suppl_4/A6.2). 
