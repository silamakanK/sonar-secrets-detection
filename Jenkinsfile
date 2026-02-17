pipeline {
    agent any

    environment {
        SONAR_HOST_URL   = 'http://sonarqube:9000'
        SONAR_PROJECT_KEY = 'secret-detection-demo'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                git branch: 'main',
                    url: 'https://github.com/silamakanK/sonar-secrets-detection.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                            sh """
                                sonar-scanner \
                                -Dsonar.projectKey=$SONAR_PROJECT_KEY \
                                -Dsonar.sources=. \
                                -Dsonar.host.url=$SONAR_HOST_URL \
                                -Dsonar.token=$SONAR_TOKEN \
                                -Dsonar.text.inclusions=**/*.env,**/*.json
                            """
                        }
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded! No secrets detected or Quality Gate passed.'
        }
        failure {
            echo 'Pipeline failed! Secrets detected or Quality Gate failed.'
        }
        always {
            echo 'Pipeline execution completed.'
        }
    }
}
