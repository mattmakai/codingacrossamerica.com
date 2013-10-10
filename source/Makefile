run:
	mkdir ./output
	cp -R theme/static/css theme/static/js theme/static/img theme/static/fonts output/
	cp -R static-html/* output/
	pelican -t theme -s settings.py content
	cp -R output/* ..
	rm -rf output/

init:
	pip install -r requirements.txt
	mkdir -p output
