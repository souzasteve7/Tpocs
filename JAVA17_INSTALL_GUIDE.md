# Java 17 Installation Guide for Windows

## Option 1: Download from Adoptium (Recommended)

1. **Go to Adoptium website**: https://adoptium.net/
2. **Select**:
   - Version: **17 - LTS**
   - Operating System: **Windows**
   - Architecture: **x64** (or arm64 if you have ARM processor)
3. **Download** the MSI installer
4. **Run the installer** and follow the setup wizard
5. **Check "Set JAVA_HOME variable"** during installation
6. **Check "JavaSoft (Oracle) registry keys"** during installation

## Option 2: Using Package Manager (Chocolatey)

If you have Chocolatey installed:
```powershell
# Install Chocolatey first if you don't have it
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Java 17
choco install temurin17
```

## Option 3: Using Winget (Windows Package Manager)

```powershell
# Install Java 17 using winget
winget install EclipseAdoptium.Temurin.17
```

## Verify Installation

After installation, **restart your terminal** and run:
```powershell
java -version
javac -version
```

You should see something like:
```
openjdk version "17.0.x"
OpenJDK Runtime Environment Temurin-17.0.x
```

## Set JAVA_HOME (if not set automatically)

1. **Open System Properties**:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click "Advanced" tab → "Environment Variables"

2. **Add JAVA_HOME**:
   - Click "New" under System Variables
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`

3. **Update PATH**:
   - Find "Path" in System Variables, click "Edit"
   - Add: `%JAVA_HOME%\bin`

## Install Maven (if needed)

Download from: https://maven.apache.org/download.cgi
- Extract to `C:\Program Files\Apache\maven`
- Add `C:\Program Files\Apache\maven\bin` to PATH
- Set `MAVEN_HOME` environment variable

## Quick Test Commands

```powershell
java -version
javac -version
mvn -version
```