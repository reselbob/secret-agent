node {
    env.NODEJS_HOME = "${tool 'basic_node'}"
    // on linux / mac
    env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
    sh 'npm --version'
}

def secretAgentAppExists = ''

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
                sh "npm test"
            }
        }
        stage('release') {
            steps {
            sh """ if ! [docker ps --format '{{.Names}}' | grep -w secret_agent &> /dev/null]; then
                    docker run -d --network='host' -p 5000:5000 --restart=always --name registry registry:2 ;
                    docker build -t secretagent:v1 . ;
                    docker tag secretagent:v1 localhost:5000/secretagent:v1 ;
                    docker run -d --network='host' -p 3050:3050 --name secret_agent localhost:5000/secretagent:v1 ;
                    echo 'Secret Agent up and running on port 3050';
                fi ;
            """
            }               
        }
    }
}
