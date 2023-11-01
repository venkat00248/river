pipeline {
    agent { label 'master' }   ///agent { label 'docker' }

    parameters {
        booleanParam(name: 'BUILD_FRONTEND', defaultValue: false, description: 'Build Frontend')
        booleanParam(name: 'BUILD_BACKEND', defaultValue: false, description: 'Build Backend')
    }

    triggers {
        githubPush()
    }

    environment {
        // Specify your environment variables.
        APP_VERSION = '1'
    }

    stages {

        stage('Code Quality Check via SonarQube') {
        steps {
        script {
        def scannerHome = tool 'sonarscanner';
            withSonarQubeEnv("sonarqube") {
            sh "${tool("sonarscanner")}/bin/sonar-scanner \
            -Dsonar.projectKey=kubernetes-am-payments \
            -Dsonar.sources=. \
            -Dsonar.css.node=. \
            -Dsonar.host.url=https://sonar.cloud4c.com \
            -Dsonar.login=0c23ed05dcf333d0d74e956383d912e5d4f906e8"
               }
           }
       }
    }


        stage('Frontend-Build') {
            when {
                expression { params.BUILD_FRONTEND == true }
            }
            steps {
                // Print all the environment variables.
                sh 'printenv'
                sh 'echo $GIT_BRANCH'
                sh 'echo $GIT_COMMIT'
               
                sh 'sudo chmod 777 -R /var/lib/jenkins/workspace/AM_PAYMENTS_UAT_SERVICE'
                sh 'sudo docker build --network=host -t am-payments-uat:"$BUILD_NUMBER" /var/lib/jenkins/workspace/AM_PAYMENTS_UAT_SERVICE/frontend'
                echo 'Uploading docker image to nexus server'
                sh 'sudo docker tag am-payments-uat:"$BUILD_NUMBER" 10.10.121.29:8085/am-payments-uat:"$BUILD_NUMBER" '
                sh 'sudo docker push 10.10.121.29:8085/am-payments-uat:"$BUILD_NUMBER" '
                sh 'sudo docker rmi -f am-payments-uat:"$BUILD_NUMBER" '
                echo 'Deploying helm chart '
                sh 'helm upgrade --install am-payments-backend /var/lib/jenkins/workspace/AM_PAYMENTS_UAT_SERVICE/frontend/helm_am-payments/ --set image=10.10.121.29:8085/am-payments-uat:"$BUILD_NUMBER" -n am-payments '

            }
        }

        stage('Backend-Build') {
            when {
                expression { params.BUILD_BACKEND == true }
            }
            steps {
                // Print all the environment variables.
                sh 'printenv'
                sh 'echo $GIT_BRANCH'
                sh 'echo $GIT_COMMIT'
                sh 'sudo chmod 777 -R /var/lib/jenkins/workspace/AM_PAYMENTS_UAT_SERVICE'
                sh 'sudo docker build --network=host -t am-payments-backend-uat:"$BUILD_NUMBER" /var/lib/jenkins/workspace/AM_PAYMENTS_UAT_SERVICE/backend'
                echo 'Uploading docker image to nexus server'
                sh 'sudo docker tag am-payments-backend-uat:"$BUILD_NUMBER" 10.10.121.29:8085/am-payments-backend-uat:"$BUILD_NUMBER" '
                sh 'sudo docker push 10.10.121.29:8085/am-payments-backend-uat:"$BUILD_NUMBER" '
                sh 'sudo docker rmi -f am-payments-backend-uat:"$BUILD_NUMBER" '
                echo 'Deploying helm chart '
                sh 'helm upgrade --install am-payments /var/lib/jenkins/workspace/AM_PAYMENTS_UAT_SERVICE/backend/helm_backend/ --set image=10.10.121.29:8085/am-payments-backend-uat:"$BUILD_NUMBER" -n am-payments '

            }
        }

        // ... (existing stages)
    }

    post {
        always {
        
        
         script {
                if (currentBuild.currentResult == 'FAILURE') {
                    emailext subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - FAILED!!!',
                        body: '$DEFAULT_CONTENT',
                        recipientProviders: [
                            [$class: 'RequesterRecipientProvider']
                        ], 
                        replyTo: '$DEFAULT_REPLYTO',
                        to: 'prakash.mekapothula@cloud4c.com,satyanarayana.reddy@cloud4c.com,santosh.kalingwar@cloud4c.com,srija.yalala@cloud4c.com '
                        
                }
            }
            /*
            script {
                if (currentBuild.currentResult == 'SUCCESS') {
                   echo 'Running ADMIN-CENTER Selenium Testcases pipeline!'
                   build job: 'Selenium/OPF-ADMIN-functional-automation-scripts/', wait: false
                }
        }
        */

              updateGitlabCommitStatus(name: 'Jenkins', state: 'success')
              }
    }

  
}



