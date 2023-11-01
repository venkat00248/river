pipeline {
    agent { label 'master' }   ///agent { label 'docker' }
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
            -Dsonar.projectKey=kubernetes-appmodernization \
            -Dsonar.sources=. \
            -Dsonar.css.node=. \
            -Dsonar.host.url=http://10.10.121.29:9000 \
            -Dsonar.login=0c23ed05dcf333d0d74e956383d912e5d4f906e8"
               }
           }
       }
    }

    stage('Code Security Scanner') {
        steps {
              sh 'sudo chmod 777 -R /var/lib/jenkins/workspace/AM_Frontend_UAT_Service/'
              sh 'trivy fs /var/lib/jenkins/workspace/AM_Frontend_UAT_Service/'
                
        }
    }

    stage('Build-appmodernization') {
        steps {
              // Print all the environment variables.
              sh 'printenv'
              sh 'echo $GIT_BRANCH'
              sh 'echo $GIT_COMMIT'
               
              sh 'sudo chmod 777 -R /var/lib/jenkins/workspace/AM_Frontend_UAT_Service'
              sh 'sudo docker build --network=host -t appmodernization-uat:"$BUILD_NUMBER" /var/lib/jenkins/workspace/AM_Frontend_UAT_Service/frontend'
              
              }
    }

    stage('Artifact to Nexus-appmodernization') {
        steps {
              echo 'Uploading docker image to nexus server'
              sh 'sudo docker tag appmodernization-uat:"$BUILD_NUMBER" 10.10.121.29:8085/appmodernization-uat:"$BUILD_NUMBER" '
              sh 'sudo docker push 10.10.121.29:8085/appmodernization-uat:"$BUILD_NUMBER" '
              sh 'sudo docker rmi -f appmodernization-uat:"$BUILD_NUMBER" '
              }
    }
               
    stage('Test') {
        steps {
                echo 'PHP Unit tests'
               
              }
    }

    stage('deployment-appmodernization') {
            
        steps {
                echo 'Deploying helm chart '
                sh 'sudo helm upgrade --install appmodernization /var/lib/jenkins/workspace/AM_Frontend_UAT_Service/frontend/helm_appmodernization/ --set image=10.10.121.29:8085/appmodernization-uat:"$BUILD_NUMBER" -n appmodernization '
              }
    }
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
