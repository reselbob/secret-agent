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
                sh "npm test"
            }
        }
        stage('release') {
            steps {
                script {
                    sh "AGENT_APP_EXISTS=$(docker ps -a | grep secret_agent)"
                    if ( AGENT_APP_EXISTS == "" ) {
                        sh "docker run -d --network='host' -p 5000:5000 --restart=always --name registry registry:2"
                        sh "docker build -t secretagent:v1 . "
                        sh "docker tag secretagent:v1 localhost:5000/secretagent:v1"
                        sh "docker push localhost:5000/secretagent:v1"
                        sh "docker run -d --network='host' -p 3050:3050 --name secret_agent localhost:5000/secretagent:v1"
                        echo 'Secret Agent up and running on port 3050'
                    }

                }
            }
        }
    }
}
