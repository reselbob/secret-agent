node {
    env.NODEJS_HOME = "${tool 'basic_node'}"
    // on linux / mac
    env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
    sh 'npm --version'
}

pipeline {
    agent any

    stages {
        stage('build') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/reselbob/secret-agent.git'
                sh "npm install"
            }
        }
        stage('test') {
            steps {
            script {
                    env.SECRET_AGENT_PORT = "3060"
                    echo "SECRET_AGENT_PORT is '${SECRET_AGENT_PORT}'"
                }
                sh "npm test"
            }
        }
        stage('release') {
            steps {
            script {
                env.SECRET_AGENT_PORT = "3050"
                echo "SECRET_AGENT_PORT is '${SECRET_AGENT_PORT}'"
            }
            // If the local registry container does not exists, create it
            sh """ if ! [ \$(docker ps --format '{{.Names}}' | grep -w registry &> /dev/null) ]; then
                     docker run -d --network='host' -p 5000:5000 --restart=always --name registry registry:2;
                   fi;
                """
            // if the secret_agent container is running, delete it in order to create a new one
            sh """ if [ \$(docker ps --format '{{.Names}}' | grep -w secret_agent &> /dev/null) ]; then
                     docker rm -f secret_agent;
                   fi;
                """
            sh "docker build -t secretagent:v1 . "
            sh "docker tag secretagent:v1 localhost:5000/secretagent:v1 "
            sh "docker run -d --network='host' -p 3050:3050 --name secret_agent localhost:5000/secretagent:v1 "
            sh "echo 'Secret Agent up and running on port 3050' "
            }               
        }
    }
}
