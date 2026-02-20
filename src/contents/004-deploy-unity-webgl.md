---
title: "Deploy Unity WebGL Project"
description: "How to publish Unity WebGL builds to play.unity.com and itch.io"
pubDate: "Jan 31 2026"
categories: ["Etc"]
---

#### 1. Setup Unity WebGL Publisher

Go to **Window → Package Manager**.

![Package Manager](../assets/posts/004/desc1.webp)

Click the **+** dropdown menu and select **Add package from git URL**.

![Add Package](../assets/posts/004/desc2.webp)

Enter the package URL:

```bash
com.unity.connect.share
```

The **Publish** tab will now appear in Unity.

![Publish Tab](../assets/posts/004/desc3.webp)

#### 2. Deploy to play.unity.com

Click **Build and Publish**. The Unity publish window will open where you can add your title and description.

#### 3. Deploy to itch.io

###### Prepare Build Files

Zip your WebGL build folder.

![Zip Files](../assets/posts/004/desc4.webp)

###### Upload to itch.io

Select **HTML** or **HTML5** as the project kind.

![Project Kind](../assets/posts/004/desc5.webp)

Upload your zip file and check **"This file will be played in the browser"**.

Adjust the resolution under **Embed options** if needed.

![Embed Options](../assets/posts/004/desc6.webp)
