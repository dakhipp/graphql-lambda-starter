##
## Used to get AWS Linux specific node_modules in order to deploy to lambda 
##

FROM amazonlinux:2017.03

RUN curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
RUN yum install -y nodejs gcc-c++ make
RUN npm install yarn -g

RUN mkdir /app
WORKDIR /app

COPY . /app

EXPOSE 8000

CMD rm -rf node_modules/ ; yarn install ; yarn run server
