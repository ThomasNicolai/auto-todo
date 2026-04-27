import {
  ConfigPlugin,
  withAndroidManifest,
  withDangerousMod,
  AndroidConfig,
} from "@expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

function addImportToKotlinFile(content: string, importStatement: string): string {
  const lines = content.split("\n");
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trimStart().startsWith("import ")) {
      lastImportIdx = i;
    }
  }
  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, importStatement);
  }
  return lines.join("\n");
}

function copyWidgetFiles(
  projectRoot: string,
  platformRoot: string,
  packageName: string,
): void {
  const packagePath = packageName.split(".").join(path.sep);
  const srcDir = path.join(
    platformRoot,
    "app",
    "src",
    "main",
    "java",
    packagePath,
  );
  fs.mkdirSync(srcDir, { recursive: true });

  const templateDir = path.join(projectRoot, "plugins", "android-widget", "src");
  const kotlinFiles = [
    "TodoWidgetProvider.kt",
    "TodoWidgetService.kt",
    "TodoWidgetBridgeModule.kt",
    "TodoWidgetBridgePackage.kt",
  ];

  for (const file of kotlinFiles) {
    const src = path.join(templateDir, file);
    let content = fs.readFileSync(src, "utf8");
    content = content.replaceAll("{{PACKAGE_NAME}}", packageName);
    fs.writeFileSync(path.join(srcDir, file), content, "utf8");
  }

  const layoutDir = path.join(platformRoot, "app", "src", "main", "res", "layout");
  const xmlDir = path.join(platformRoot, "app", "src", "main", "res", "xml");
  fs.mkdirSync(layoutDir, { recursive: true });
  fs.mkdirSync(xmlDir, { recursive: true });

  const resLayoutDir = path.join(
    projectRoot,
    "plugins",
    "android-widget",
    "res",
    "layout",
  );
  for (const file of ["widget_todo.xml", "widget_todo_item.xml"]) {
    fs.copyFileSync(path.join(resLayoutDir, file), path.join(layoutDir, file));
  }

  fs.copyFileSync(
    path.join(projectRoot, "plugins", "android-widget", "res", "xml", "todo_widget_info.xml"),
    path.join(xmlDir, "todo_widget_info.xml"),
  );
}

function patchMainApplication(platformRoot: string, packageName: string): void {
  const packagePath = packageName.split(".").join(path.sep);
  const mainAppPath = path.join(
    platformRoot,
    "app",
    "src",
    "main",
    "java",
    packagePath,
    "MainApplication.kt",
  );

  if (!fs.existsSync(mainAppPath)) return;

  let content = fs.readFileSync(mainAppPath, "utf8");

  if (content.includes("TodoWidgetBridgePackage")) return;

  content = addImportToKotlinFile(
    content,
    `import ${packageName}.TodoWidgetBridgePackage`,
  );

  const primaryAnchor = "// add(MyReactNativePackage())";
  const fallbackAnchor = "PackageList(this).packages.apply {";

  if (content.includes(primaryAnchor)) {
    content = content.replace(
      primaryAnchor,
      `${primaryAnchor}\n          add(TodoWidgetBridgePackage())`,
    );
  } else if (content.includes(fallbackAnchor)) {
    content = content.replace(
      fallbackAnchor,
      `${fallbackAnchor}\n          add(TodoWidgetBridgePackage())`,
    );
  }

  fs.writeFileSync(mainAppPath, content, "utf8");
}

function addWidgetToManifest(
  manifest: AndroidConfig.Manifest.AndroidManifest,
  packageName: string,
): void {
  const app = AndroidConfig.Manifest.getMainApplication(manifest);
  if (!app) return;

  if (!app.receiver) app.receiver = [];

  const alreadyHasWidget = app.receiver.some(
    (r) => r.$?.["android:name"] === ".TodoWidgetProvider",
  );

  if (!alreadyHasWidget) {
    app.receiver.push({
      $: {
        "android:name": ".TodoWidgetProvider",
        "android:exported": "true",
      },
      "intent-filter": [
        {
          action: [
            {
              $: { "android:name": "android.appwidget.action.APPWIDGET_UPDATE" },
            },
          ],
        },
      ],
      "meta-data": [
        {
          $: {
            "android:name": "android.appwidget.provider",
            "android:resource": "@xml/todo_widget_info",
          },
        },
      ],
    } as any);
  }

  if (!app.service) app.service = [];

  const alreadyHasService = app.service.some(
    (s) => s.$?.["android:name"] === ".TodoWidgetService",
  );

  if (!alreadyHasService) {
    app.service.push({
      $: {
        "android:name": ".TodoWidgetService",
        "android:permission": "android.permission.BIND_REMOTEVIEWS",
        "android:exported": "false",
      },
    });
  }
}

const withAndroidWidget: ConfigPlugin = (config) => {
  config = withDangerousMod(config, [
    "android",
    (config) => {
      const { projectRoot, platformProjectRoot } = config.modRequest;
      const packageName = config.android?.package;

      if (!packageName) {
        throw new Error(
          "[withAndroidWidget] android.package must be set in app.json before running expo prebuild.",
        );
      }

      copyWidgetFiles(projectRoot, platformProjectRoot, packageName);
      patchMainApplication(platformProjectRoot, packageName);

      return config;
    },
  ]);

  config = withAndroidManifest(config, (config) => {
    const packageName = config.android?.package ?? "";
    addWidgetToManifest(config.modResults, packageName);
    return config;
  });

  return config;
};

export default withAndroidWidget;
