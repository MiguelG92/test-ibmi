# Use a Fedora-based base image
FROM fedora:latest

# Update package manager and install Node.js and npm
RUN dnf -y update
RUN dnf -y install nodejs npm

# Install IBM iAccess ODBC drivers
RUN curl https://public.dhe.ibm.com/software/ibmi/products/odbc/rpms/ibmi-acs.repo | tee /etc/yum.repos.d/ibmi-acs.repo
RUN dnf -y install --refresh ibm-iaccess
RUN dnf clean all

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source code
COPY . .

# Build the app
RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000
EXPOSE ${PORT}

CMD [ "node", "." ]
