@echo off
echo ==========================================
echo ACME College Frontend Deployment Script
echo ==========================================

echo.
echo [1/4] Building React App...
cd acme-react-frontend
call npm run build
cd ..

echo.
echo [2/4] Cleaning old frontend files...
if exist "JSF-ACMECollege-Skeleton\JSF-ACMECollege-Skeleton\src\main\webapp\static" (
    rmdir /s /q "JSF-ACMECollege-Skeleton\JSF-ACMECollege-Skeleton\src\main\webapp\static"
)

echo.
echo [3/4] Copying new build files to JSF project...
xcopy "acme-react-frontend\build\*" "JSF-ACMECollege-Skeleton\JSF-ACMECollege-Skeleton\src\main\webapp\" /E /H /C /I /Y

echo.
echo [4/4] Packaging Maven Project...
call mvn -f "JSF-ACMECollege-Skeleton\JSF-ACMECollege-Skeleton\pom.xml" clean package

echo.
echo ==========================================
echo Done! Please redeploy/publish JSF-ACMECollege-Skeleton in Eclipse.
echo ==========================================
pause
