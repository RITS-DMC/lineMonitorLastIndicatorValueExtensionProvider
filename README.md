To begin, we need to clone projects:

  lineMonitorLastIndicatorValueExtensionProvider

  util

**1. Clone the Repository**
    - Clone the repository into the following path inside your plugin project: (yourPlugin/webapp/lineMonitorLastIndicatorValueExtensionProvider)
    - Open and Identify data-name in your plugin’s index.html file.
    - Identify the value of the data-name attribute (e.g., rits.custom.plugin.linemonitorpodplugins). This will be used in the upcoming search-and-replace operations
	
**2. Search and Replace in the Cloned Folder**
    - Right-click on the cloned folder lineMonitorLastIndicatorValueExtensionProvider.
    - Select "Find in Folder".
    - Perform the following search-and-replace operations:
        i. Replace 1:
            - Use this in the Search field: rits.custom.plugin.linemonitorpodplugins
            - Use this in the replace field: with your namespace from the index.html file
            - Click "Replace All Icon".
        ii. Replace 2:
            - Use this in the Search field: rits/custom/plugin/linemonitorpodplugins
            - Convert your data-name (e.g., rits.custom.plugin.linemonitorpodplugins) to a folder path by replacing dots . with slashes / (e.g., rits/custom/plugin/linemonitorpodplugins).
            - Use this in the replace field: with your namespace from the index.html file 
            - Click "Replace All Icon".
			
**3. Update component.json**
    - Open the file: yourPlugin/webapp/designer/component.json
    - Inside the extensions list, add an entry for the plugin with the following structure:
	   after the components:
	   rits/custom/plugin/linemonitorpodplugins: this namespace you can take it from the index.html.
	   
          "extensions": [
        {
            "provider": "rits/custom/plugin/linemonitorpodplugins/lineMonitorLastIndicatorValueExtensionProvider/ExtensionProvider",
            "controller": "sap.dm.dme.lmplugins.indicatorActualValuePlugin",
            "inclusions": [
                {
                    "pods": [
                         "pod1", "pod2"
                    ],
                    "plants": [
                        "plant1", "plant2"
                    ]
                }
            ]
        }
    ]
    **Important Note: After pasting the above JSON:
          i. Ensure provider matches the correct plugin path. It should be: <data-name with slashes>/lineMonitorLastIndicatorValueExtensionProvider/ExtensionProvider. For example, if your data-name is rits.custom.plugin.linemonitorpodplugins, then it becomes: rits/custom/plugin/linemonitorpodplugins/lineMonitorLastIndicatorValueExtensionProvider/ExtensionProvider.
          ii. Ensure pods and plants are updated based on your actual deployment targets. Replace "pod1", "pod2" and "plant1", "plant2" with real values.**
		  
**4. Build and Deploy Your Plugin**
      - Build your plugin project using your standard build process.
      - Deploy it to your target environment.
	  
**5. Verify the Result**
      - Navigate to the relevant section in your app.
      - Verify that the extension is functioning correctly and is visible for the specified pods and plants defined in the component.json file.
	  
  Note:  clone the util project from the following GitHub repository:  https://github.com/SAP-samples/digital-manufacturing-extension-samples.git
         Navigate to: dmc-coreplugin-extension > plugins > webapp > utils  and repeat the same setup process for this utility project as well	
  
**6. Configuring the Line Monitor Last Indicator Value Plugin:

      Open the POD Designer app and either open an existing Line Monitor POD or create a copy from the Default Line Monitor POD.
      Add a new Plugin Container Control and include the Line Monitor Last Indicator Value Plugin to the "Asset Details (Layout)" page.
      Mark this newly added plugin as Default.the Configuration Panel of the plugin, click "Configure Indicators".
      On the left-hand panel, expand each Work Center to view all Equipment and Assets mapped to child Resources.
      Select the Indicators (e.g., BatchNumber, DeviceSerialNumber, FunctionalTestResult, ManufacturingDate) you wish to display in the Line Monitor POD for each Work Center.
      Save the POD configuration.
      Open your Line Monitor POD, navigate to the Asset Details page for one of the configured Work Centers, and verify that the Indicators appear with an initial value of “-”.

**7. Creating a Cloud Process to Post Last Indicator Values:

      In Production Process Designer, create a new Cloud Process.
      Add a Start Control and define the following input parameters:

        inAssetId (String)
        inPlant (String)
        inWorkCenter (String)
		
      From the Services and Processes panel on the left:
      Drag and drop the "Read Indicator" service onto the canvas.
      Configure it by selecting the appropriate Asset via value help.
      Select the following Indicators:

        BatchNumber
        DeviceSerialNumber
        FunctionalTestResult
        ManufacturingDate
		
      Create a local variable with initial index = 0 and assign this variable as input to the Script Task.
      Drag a Script Task to the canvas and define the following input parameters (all String type unless specified):

        stInBatchNumber
        stInDeviceSerialNumber
        stInFunctionalTest
        stInManufaDate
        stInLvReadIndicator (Integer, mapped from local variable)
        Implement the following logic inside the Script Task:

         javascript
         var batchNumber = $input.stInBatchNumber;
         var deviceNumber = $input.stInDeviceSerialNumber;
         var manufactureDate = $input.stInManufaDate;
         var functionalTest = $input.stInFunctionalTest;
         var currentIndex = $input.stInLvReadIndicator;
         var indicatorsData = [
                { "BatchNumber": batchNumber },
                { "DeviceSerialNumber": deviceNumber },
                { "ManufacturingDate": manufactureDate },
                { "FunctionalTestResult": functionalTest }
            ];

          $output.stOutIndicatorsLength = indicatorsData.length;
          var firstIndicatorData = indicatorsData[currentIndex];
          var indicatorName = Object.keys(firstIndicatorData)[0];   
		  var indicatorValue = firstIndicatorData[indicatorName];
		  $output.stOutIndicatorName = indicatorName;
		  $output.stIndicatorValue = indicatorValue;
		  $output.stOutput = firstIndicatorData;
		  $output.stOutLvReadIndicatorIndex = currentIndex + 1;
		  
        Create and map the respective output parameters for the Script Task.
        From the "Last Indicator Value" group under Services:
        Drag the "Post Last Indicator Value" service onto the canvas.
        Map indicatorName and indicatorValue input parameters of this service using the outputs of the Script Task.
        Add a Condition Control to loop through all indicators:
        Connect the true path back to the Script Task.
        Connect the false path to the End Control.
        Save and Deploy the process.

**8. Test the Process:

      Run the deployed Cloud Process manually.
      Provide the required input parameters (Asset ID, Plant, Work Center).
      Asset ID can be retrieved from the Manage Assets app.
      After successful execution, the configured Indicator values should appear in the Line Monitor POD, under the Asset Details section.
